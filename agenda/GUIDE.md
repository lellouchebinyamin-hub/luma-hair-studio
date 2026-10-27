# Relier les réservations du site à Google Agenda

À la fin, chaque rendez-vous pris sur le site s'ajoute tout seul dans le Google Agenda du salon. Il s'affiche dans le téléphone du coiffeur avec un rappel 1 h avant et 15 min avant. Le site montre aussi les vrais créneaux libres : si le coiffeur bloque un créneau ou une journée dans son agenda, ce créneau ne peut plus être réservé.

Durée : environ 5 minutes. Il faut le compte Google du salon (ou celui du coiffeur).

## 1. Créer le script

1. Ouvrir **https://script.google.com** avec le compte Google du salon.
2. Cliquer sur **Nouveau projet**.
3. Effacer tout le texte, puis coller le contenu du fichier **Code.gs** (dans ce même dossier).
4. Renommer le projet en « LUMA Réservations » et cliquer sur 💾 **Enregistrer**.

## 2. Le publier

1. En haut à droite, cliquer sur **Déployer → Nouveau déploiement**.
2. Cliquer sur la roue ⚙️ à côté de « Sélectionner le type », puis choisir **Application Web**.
3. Remplir :
   - **Exécuter en tant que** : *Moi*
   - **Qui a accès** : *Tout le monde*
4. Cliquer sur **Déployer**, puis sur **Autoriser l'accès** et choisir le compte du salon.
   Google affiche « Google n'a pas validé cette application ». C'est normal, car c'est votre propre script : cliquer sur **Paramètres avancés**, puis **Accéder à LUMA Réservations**, puis **Autoriser**.
5. Copier l'**URL de l'application Web**. Elle ressemble à `https://script.google.com/macros/s/AKfy…/exec`.

Envoyez-moi cette URL : je la mets dans le site et je teste avec une vraie réservation.

## 3. Sur le téléphone du coiffeur

- **Android** : l'agenda Google est déjà là. Il suffit d'être connecté avec le même compte.
- **iPhone** : installer l'app **Google Agenda**, ou bien aller dans Réglages → Calendrier → Comptes → Ajouter un compte → Google.
- **Plusieurs coiffeurs** : partager l'agenda du salon avec chacun (dans Google Agenda sur ordinateur : Paramètres de l'agenda → Partager avec des personnes). Chaque rendez-vous est coloré selon le coiffeur choisi : Ariel en gris, Daniel en bleu, Noa en orange.

## Bon à savoir

- **Bloquer un créneau** (pause, rendez-vous privé) : créer un événement dans l'agenda.
- **Bloquer une journée** (congé) : créer un événement « Toute la journée ».
- Chaque événement contient le nom, le téléphone, le service, la note du client, et un lien WhatsApp direct vers lui.
- **Changer les noms des coiffeurs** : modifier la ligne `STAFF` au début de Code.gs, puis faire **Déployer → Gérer les déploiements → ✏️ → Nouvelle version**. L'URL reste la même.
- C'est gratuit : Google autorise largement plus de réservations par jour qu'un salon n'en reçoit.
