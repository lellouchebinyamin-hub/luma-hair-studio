/**
 * LUMA · réservations → Google Agenda
 * Web app Google Apps Script : le site lit les créneaux occupés (GET)
 * et crée le rendez-vous dans l'agenda du salon (POST).
 */

// Agenda où arrivent les rendez-vous. 'primary' = l'agenda principal du compte Google.
const CALENDAR_ID = 'primary';
// Coiffeurs : un créneau « sans préférence » reste libre tant qu'il reste quelqu'un.
const STAFF = ['Ariel', 'Daniel', 'Noa'];
// Couleur de l'événement par coiffeur.
const COLORS = { Ariel: CalendarApp.EventColor.GRAY, Daniel: CalendarApp.EventColor.BLUE, Noa: CalendarApp.EventColor.ORANGE };

function cal_() { return CALENDAR_ID === 'primary' ? CalendarApp.getDefaultCalendar() : CalendarApp.getCalendarById(CALENDAR_ID); }
function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function whoOf_(ev) { return ev.getTag('luma_who') || ''; }

// GET ?from=2026-10-27&days=21  →  { ok, busy: [ { s, e, who, all } ] }  (millisecondes)
function doGet(e) {
  const p = e.parameter || {}, days = Math.min(+p.days || 21, 60);
  const from = p.from ? new Date(p.from + 'T00:00:00') : new Date();
  const to = new Date(from.getTime() + days * 864e5);
  const busy = cal_().getEvents(from, to).map(ev => ({
    s: ev.getStartTime().getTime(), e: ev.getEndTime().getTime(), who: whoOf_(ev), all: ev.isAllDayEvent()
  }));
  return json_({ ok: true, busy: busy });
}

// POST { service, minutes, who, start (ISO), name, phone, note }
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const b = JSON.parse(e.postData.contents);
    const name = String(b.name || '').slice(0, 40).trim();
    const phone = String(b.phone || '').replace(/[^\d+\- ]/g, '').slice(0, 16);
    const minutes = Math.max(15, Math.min(+b.minutes || 60, 300));
    const start = new Date(b.start), end = new Date(start.getTime() + minutes * 6e4);
    if (!name || phone.replace(/\D/g, '').length < 9 || isNaN(start)) return json_({ ok: false, error: 'invalid' });
    if (start < new Date()) return json_({ ok: false, error: 'past' });

    // Le créneau est-il encore libre ? (journée entière bloquée = congé)
    const who = STAFF.indexOf(b.who) > -1 ? b.who : '';
    const over = cal_().getEvents(start, end);
    if (over.some(ev => ev.isAllDayEvent())) return json_({ ok: false, error: 'taken' });
    const clash = who ? over.some(ev => whoOf_(ev) === who) : over.length >= STAFF.length;
    if (clash) return json_({ ok: false, error: 'taken' });

    const service = String(b.service || '').slice(0, 60);
    const ev = cal_().createEvent('✂ ' + service + ' · ' + name, start, end, {
      description: [
        'Client : ' + name,
        'Téléphone : ' + phone,
        'Service : ' + service,
        'Coiffeur : ' + (who || 'sans préférence'),
        b.note ? 'Note : ' + String(b.note).slice(0, 240) : '',
        'WhatsApp : https://wa.me/' + phone.replace(/\D/g, '').replace(/^0/, '972')
      ].filter(Boolean).join('\n')
    });
    ev.setTag('luma_who', who);
    if (COLORS[who]) ev.setColor(COLORS[who]);
    ev.removeAllReminders(); ev.addPopupReminder(60); ev.addPopupReminder(15);
    return json_({ ok: true, id: ev.getId() });
  } catch (err) {
    return json_({ ok: false, error: 'server' });
  } finally {
    lock.releaseLock();
  }
}
