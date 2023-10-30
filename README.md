# Qui Veut Gagner des Millions - Vue.js Edition

Ce projet est une réplique du célèbre jeu télévisé "Qui Veut Gagner des Millions", conçu avec Vue.js. Il intègre des fonctionnalités avancées telles que les véritables sons du jeu, la gestion des lumières SmartLife Tuya et une option "avis du public" en temps réel grâce aux websockets.

## Caractéristiques principales:

- **Sons Authentiques:** Revivez l'expérience du jeu avec les sons originaux.
- **Contrôle des Lumières SmartLife Tuya:** Augmentez l'ambiance en contrôlant les lumières pendant le jeu.
- **Avis du Public en Temps Réel:** Grâce aux websockets, permettez à votre public d'interagir via leurs smartphones.
- **Jokers:** Outre l'avis du public, le jeu dispose également des jokers classiques comme le "50/50" et "l'appel à un ami".

## Écrans disponibles:

- **Écran Présentateur** ([http://localhost:3000/presenter](http://localhost:3000/presenter)): Permet de contrôler le déroulement du jeu, des musiques, de sélectionner les questions pour le joueur et de gérer les jokers.
- **Écran Public** ([http://localhost:3000/](http://localhost:3000/)): Cet écran doit être projeté, par exemple, sur un Chromecast ou un écran équipé d'enceintes puisque tous les sons et musiques du jeu sont joués à partir de cet écran.
- **Écran Invité** ([http://localhost:3000/guest](http://localhost:3000/guest)): Affichage pour les joueurs. Il montre les questions, la sélection, la bonne réponse, les paliers, les jokers disponibles, les statistiques de l'avis du public et le compte à rebours pour les jokers.

- **Écran Formulaire** ([http://localhost:3000/form](http://localhost:3000/form)): Utilisé par le public pour donner leur avis sur une question. Lorsque le joker "avis du public" est activé par le présentateur, un code QR est affiché sur l'écran public pour accéder rapidement au formulaire. Le formulaire est automatisé et n'a pas besoin d'être rafraîchi pour les parties suivantes.

## Prérequis:

1. Node.js et NPM installés sur votre machine.

## Mise en place et exécution:

1. **Clonez ce dépôt**:

   ```bash
   git clone https://github.com/palybok/qui-veut-gagner-des-millions.git
   ```

2. **Accédez au dossier du projet**:

   ```bash
   cd qui-veut-gagner-des-millions
   ```

3. **Installez les dépendances**:

   ```bash
   npm install
   ```

4. **Configuration**:

   - Configurez les options d'authentification SmartLife et autres paramètres dans `src/stores/config.js`.
   - Une fois l'application lancée, accédez au stockage local de votre navigateur pour récupérer l'identifiant des ampoules SmartLife. Ajoutez ensuite ces identifiants dans le fichier `src/stores/config.js`.
   - Saisissez l'adresse IP locale de l'ordinateur exécutant le jeu. Pour cela:
     - Sur Linux: Exécutez `ifconfig` pour obtenir l'adresse IP.
     - Sur Windows: Exécutez `ipconfig` pour obtenir l'adresse IP.

5. **Lancez le jeu**:

   ```bash
   npm run dev
   ```

   Ceci démarrera le jeu en local et mettra à disposition les ports `3000` pour l'application principale et `3001` pour les websockets.

## À noter:

Les participants et le public doivent être sur le même réseau que l'ordinateur exécutant le jeu pour accéder aux différents écrans et fonctionnalités.

## Contribuer:

N'hésitez pas à contribuer à ce projet en soumettant des PRs ou en signalant des bugs.

---

Amusez-vous bien et tentez votre chance pour remporter le jackpot ! 🏆
