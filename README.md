# Classement Tournoi - Application React

Ce projet est une application web réalisée en **React** avec **TailwindCSS**. Elle affiche un **classement dynamique** provenant d’un **Google Sheet public**, avec plusieurs feuilles sélectionnables, des effets d’animation, un système de recherche, et une interface responsive.

Le but est d'afficher aisément les scores pour les tournois d'**HOD**

## 🧠 Fonctionnalités

- 🔍 **Barre de recherche** permettant de trouver un nom dans la liste.
  - Si le nom est visible, il est **surligné**.
  - S’il est en dehors de l’écran, il est **affiché en bas**.
- 📈 **Récupération des données** depuis un Google Sheet en lecture seule.
- 📑 **Menu déroulant** pour sélectionner différentes feuilles.
  - Chaque feuille peut être paramétrée comme **triée en croissant ou décroissant**.
- 🌈 **Effet enchantement _(Minecraft)_** pour les personnes ayant un score **supérieur à la moyenne**.
- 💃 **Effet _"danse"_** pour les trois premiers du classement.
- 🖥️ Responsive.
- ⚡ Optimisé pour les performances et une bonne UX.

## 🔧 Stack technique

- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Google Sheets API](https://developers.google.com/sheets/api)
- CSS animations personnalisées

## 📁 Structure du projet

```bash
.
├── package.json
├── package-lock.json
├── postcss.config.js
├── public
│   ├── icon.png
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
├── src
│   ├── animations.css
│   ├── App.jsx
│   ├── components
│   │   ├── RankingTable.jsx
│   │   ├── row
│   │   │   ├── HighlightRow.jsx
│   │   │   └── Row.jsx
│   │   └── SearchBar.jsx
│   ├── index.css
│   └── index.js
└── tailwind.config.js
```

## 🚀 Installation

### Prérequis

- Node.js et npm installés
- Un Google Sheet public avec plusieurs feuilles contenant deux colonnes : `Nom` et `Score`

### Étapes

1. Clone le projet :

```bash
git clone https://github.com/VivicatcHub/HOD_Tournaments.git
cd HOD_Tournaments/tournaments-ranking
```

2. Installe les dépendances

```bash
npm install
```

3. Ajoute tes informations de Google Sheet dans le fichier source (App.jsx ou un fichier config selon l’implémentation) :

```jsx
const sheetOptions = [
  { name: "Nom de la Sheet 1", ascending: true },
  { name: "Nom de la Sheet 2", ascending: true },
  { name: "Nom de la Sheet 3", ascending: false },
];
```

4. Démarre le projet :

```bash
npm start
```

## ⚠️ Quotas Google Sheets API

Attention : la Google Sheets API a un quota par défaut de 60 requêtes/minute/utilisateur. Si tu dépasses cette limite, tu verras cette erreur :

```
Quota exceeded for quota metric 'Read requests' and limit 'Read requests per minute per user'
```

## ✅ À faire / améliorations possibles

- Ajouter un système de pagination
- Ajouter un export CSV
- Gérer les erreurs réseau plus proprement
- Ajouter un thème sombre
- Créer un panel admin et une vraie base de donnée
