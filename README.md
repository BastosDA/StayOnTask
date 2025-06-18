# **STAYONTASK**

### *Restez concentré. Accomplissez plus. Dominez votre journée.*

![Last Commit](https://img.shields.io/github/last-commit/BastosDA/StayOnTask?label=last%20commit)
![Typescript](https://img.shields.io/badge/typescript-94.4%25-blue)
![Languages](https://img.shields.io/github/languages/count/BastosDA/StayOnTask?label=languages)

### *Construit avec les outils et technologies suivants :*

![JSON](https://img.shields.io/badge/-JSON-black?logo=json&logoColor=white)
![Markdown](https://img.shields.io/badge/-Markdown-black?logo=markdown&logoColor=white)
![npm](https://img.shields.io/badge/-npm-red?logo=npm&logoColor=white)
![Autoprefixer](https://img.shields.io/badge/-Autoprefixer-red?logo=autoprefixer&logoColor=white)
![PostCSS](https://img.shields.io/badge/-PostCSS-orange?logo=postcss&logoColor=white)
![JavaScript](https://img.shields.io/badge/-JavaScript-yellow?logo=javascript&logoColor=black)
![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/-Vite-646CFF?logo=vite&logoColor=white)
![ESLint](https://img.shields.io/badge/-ESLint-4B32C3?logo=eslint&logoColor=white)

---

## 🌟 **POINTS FORTS**

- **Interface moderne et intuitive** avec animations fluides et design glassmorphism
- **Trois outils de productivité intégrés** : TodoList, Kanban et Pomodoro Timer
- **Glisser-déposer avancé** pour une organisation visuelle des tâches
- **Persistance automatique** des données avec localStorage
- **Design responsive** adapté à tous les écrans
- **Timer Pomodoro personnalisable** avec notifications sonores
- **Développé en TypeScript** pour une meilleure robustesse du code

---

## ℹ️ **APERÇU**

**StayOnTask** est une application web moderne de productivité personnelle qui combine trois outils essentiels dans une interface élégante. Conçue pour les étudiants, professionnels et toute personne souhaitant optimiser sa gestion du temps, elle offre une expérience utilisateur fluide et motivante.

Cette application a été développée avec les dernières technologies web (React 18, TypeScript, TailwindCSS) pour garantir performance, maintenabilité et évolutivité. L'interface utilisateur privilégie la simplicité d'usage tout en conservant des fonctionnalités avancées.

---

## 🚀 **DÉMONSTRATION**

```bash
# Installation simple en une ligne
npm install && npm run dev
```

L'application se lance automatiquement sur `http://localhost:5173` avec une interface moderne comprenant :

- **Page d'accueil** : Vue d'ensemble élégante
- **TodoList** : Gestion complète des tâches avec priorités et catégories  
- **Kanban** : Organisation visuelle par glisser-déposer
- **Pomodoro** : Timer personnalisable avec notifications

---

## ⬇️ **INSTALLATION**

```bash
npm install
npm run dev
```

**Prérequis :** Node.js 16+ et npm

**Plateformes supportées :** Windows, macOS, Linux (tous navigateurs modernes)

---

## **SCRIPTS DISPONIBLES**

```bash
npm run dev          # Démarrer le serveur de développement
npm run build        # Construire l'application pour la production
npm run preview      # Prévisualiser la build de production
npm run lint         # Vérifier la qualité du code avec ESLint
npm run type-check   # Vérifier les types TypeScript
```

---

## **STRUCTURE DU PROJET**

```
stayontask/
├── public/              # Fichiers statiques
├── src/
│   ├── Components/      # Composants React réutilisables
│   │   ├── Kanban.tsx      # Tableau Kanban principal
│   │   ├── KanbanCard.tsx  # Cartes de tâches
│   │   ├── KanbanColumn.tsx # Colonnes du tableau
│   │   ├── Layout.tsx      # Structure générale
│   │   ├── Pomodoro.tsx    # Timer Pomodoro
│   │   └── TodoList.tsx    # Liste de tâches
│   ├── hooks/           # Hooks React personnalisés
│   │   └── useTodos.ts     # Gestion des tâches
│   ├── pages/           # Pages de l'application
│   │   ├── Home.tsx        # Page d'accueil
│   │   ├── Kanban.tsx      # Page Kanban
│   │   ├── Pomodoro.tsx    # Page Pomodoro
│   │   └── ToDo.tsx        # Page Todo
│   ├── App.tsx          # Composant principal
│   └── main.tsx         # Point d'entrée
└── package.json         # Configuration du projet
```

---

## **FONCTIONNALITÉS AVANCÉES**

### **Persistance des Données**
- Stockage local automatique avec localStorage
- Sauvegarde instantanée de toutes les modifications
- Récupération des données au redémarrage

### **Interface Utilisateur**
- Design responsive pour tous les écrans
- Animations fluides et transitions
- Mode sombre/clair adaptatif
- Effets de glassmorphism modernes

### **Accessibilité**
- Support complet du clavier
- Lecteurs d'écran compatibles
- Contrastes optimisés
- Navigation intuitive

---

## **UTILISATION**

### **Gestion des Tâches**
1. Accédez à la page "Todo" depuis le menu de navigation
2. Ajoutez une nouvelle tâche avec titre, description, priorité et catégorie
3. Définissez une date d'échéance si nécessaire
4. Modifiez le statut selon l'avancement

### **Tableau Kanban**
1. Naviguez vers la page "Kanban"
2. Glissez-déposez les tâches entre les colonnes
3. Visualisez l'avancement global de vos projets

### **Timer Pomodoro**
1. Ouvrez la page "Pomodoro"
2. Configurez les durées dans les paramètres si désiré
3. Cliquez sur "Démarrer" pour commencer une session
4. Respectez les pauses entre les sessions de travail

---

## **PERSONNALISATION**

Le projet utilise TailwindCSS pour un styling flexible. Vous pouvez facilement personnaliser :
- Les couleurs et thèmes dans `tailwind.config.js`
- Les durées d'animation
- Les composants visuels
- Les gradients et effets

---
