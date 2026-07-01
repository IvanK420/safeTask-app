# Documentation Technique — SafeTask

## Table des matières

1. [Vue d'ensemble](#1-vue-densemble)
2. [Architecture globale](#2-architecture-globale)
3. [Structure du projet](#3-structure-du-projet)
4. [Backend](#4-backend)
   - [Stack technique](#41-stack-technique)
   - [Configuration et démarrage](#42-configuration-et-démarrage)
   - [Base de données](#43-base-de-données)
   - [Modèles de données](#44-modèles-de-données)
   - [API REST — Référence des endpoints](#45-api-rest--référence-des-endpoints)
   - [Middleware d'authentification](#46-middleware-dauthentification)
   - [Sécurité](#47-sécurité)
5. [Frontend](#5-frontend)
   - [Stack technique](#51-stack-technique)
   - [Configuration et démarrage](#52-configuration-et-démarrage)
   - [Routing et protection des routes](#53-routing-et-protection-des-routes)
   - [Gestion de l'authentification (AuthContext)](#54-gestion-de-lauthentification-authcontext)
   - [Client HTTP (Axios)](#55-client-http-axios)
   - [Pages et composants](#56-pages-et-composants)
6. [Tests](#6-tests)
7. [Flux applicatif complet](#7-flux-applicatif-complet)
8. [Variables d'environnement](#8-variables-denvironnement)
9. [Lancer le projet en local](#9-lancer-le-projet-en-local)

---

## 1. Vue d'ensemble

**SafeTask** est une application web full-stack de gestion de tâches personnelles. Chaque utilisateur dispose d'un compte isolé : il ne peut créer, voir, modifier ou supprimer que ses propres tâches. Un widget météo connecté à des APIs publiques est intégré au tableau de bord.

| Domaine     | Technologie principale       |
|-------------|------------------------------|
| Backend     | Node.js, Express 5, SQLite   |
| Frontend    | React 19, Vite, React Router |
| Auth        | JWT (jsonwebtoken), bcrypt   |
| Tests       | Jest, Supertest              |

---

## 2. Architecture globale

```
┌─────────────────────────────────────────┐
│              NAVIGATEUR                 │
│  React 19 + Vite (port 5173)            │
│  ┌──────────────────────────────────┐   │
│  │  AuthContext (JWT en localStorage)│   │
│  │  Axios (intercepteur Bearer)     │   │
│  │  Pages : Login / Register /      │   │
│  │          Dashboard               │   │
│  └──────────────┬───────────────────┘   │
└─────────────────┼───────────────────────┘
                  │ HTTP/JSON (CORS)
┌─────────────────▼───────────────────────┐
│              BACKEND                    │
│  Express 5 (port 5000)                  │
│  ┌──────────────────────────────────┐   │
│  │  Helmet · CORS · Rate Limiting   │   │
│  │  /api/auth  (register, login)    │   │
│  │  /api/tasks (CRUD protégé JWT)   │   │
│  │  /api/health                     │   │
│  └──────────────┬───────────────────┘   │
│                 │ Sequelize ORM         │
│  ┌──────────────▼───────────────────┐   │
│  │  SQLite  (database.sqlite)       │   │
│  │  Tables : Users, Tasks           │   │
│  └──────────────────────────────────┘   │
└─────────────────────────────────────────┘
                  │ HTTPS (API publiques)
         ┌────────▼────────┐
         │  Open-Meteo     │  (météo)
         │  Nominatim OSM  │  (géocodage)
         └─────────────────┘
```

---

## 3. Structure du projet

```
safeTask-app/
├── backend/
│   ├── config/
│   │   └── db.js               # Instance Sequelize / SQLite
│   ├── middleware/
│   │   └── auth.js             # Vérification JWT
│   ├── models/
│   │   ├── index.js            # Relations User ↔ Task
│   │   ├── User.js             # Modèle utilisateur
│   │   └── Task.js             # Modèle tâche
│   ├── routes/
│   │   ├── auth.js             # POST /register, POST /login
│   │   └── tasks.js            # CRUD /tasks (protégé)
│   ├── tests/
│   │   ├── setup.js            # Config Jest (BDD en mémoire)
│   │   ├── auth.test.js        # Tests d'intégration auth
│   │   └── tasks.test.js       # Tests d'intégration tasks
│   ├── app.js                  # Application Express (sans listen)
│   ├── index.js                # Point d'entrée (sync BDD + listen)
│   ├── jest.config.js
│   ├── package.json
│   └── .env                    # Variables d'environnement (non versionné)
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── axios.js            # Instance Axios + intercepteur JWT
    │   ├── components/
    │   │   ├── ProtectedRoute.jsx  # Guard de route
    │   │   ├── TaskModal.jsx       # Modale détail tâche
    │   │   └── WeatherWidget.jsx   # Widget météo
    │   ├── context/
    │   │   └── AuthContext.jsx     # Contexte auth global
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   └── Dashboard.jsx       # Page principale CRUD
    │   ├── App.jsx                 # Router principal
    │   ├── main.jsx                # Point d'entrée React
    │   └── index.css
    ├── vite.config.js
    └── package.json
```

---

## 4. Backend

### 4.1 Stack technique

| Package              | Version  | Rôle                                    |
|----------------------|----------|-----------------------------------------|
| express              | ^5.2.1   | Serveur HTTP                            |
| sequelize            | ^6.37.8  | ORM                                     |
| sqlite3              | ^6.0.1   | Driver base de données                  |
| jsonwebtoken         | ^9.0.3   | Génération et vérification des JWT      |
| bcrypt               | ^6.0.0   | Hachage des mots de passe               |
| helmet               | ^8.2.0   | Headers HTTP de sécurité                |
| cors                 | ^2.8.6   | Contrôle des origines cross-domain      |
| express-rate-limit   | ^8.5.2   | Limitation de débit (ANSSI PA-079)      |
| dotenv               | ^17.4.2  | Chargement des variables d'environnement|
| nodemon *(dev)*      | ^3.1.14  | Rechargement automatique en dev         |
| jest *(dev)*         | ^29.7.0  | Framework de tests                      |
| supertest *(dev)*    | ^7.2.2   | Tests HTTP d'intégration                |

### 4.2 Configuration et démarrage

`backend/index.js` est le point d'entrée. Il charge les variables d'environnement, synchronise la base de données (mode `alter` : mise à jour du schéma sans perte de données) puis démarre le serveur sur le port configuré.

`backend/app.js` configure l'instance Express et est exporté séparément pour permettre aux tests de l'importer sans démarrer le serveur.

### 4.3 Base de données

- **Moteur** : SQLite (fichier `backend/database.sqlite`)
- **ORM** : Sequelize 6 avec `dialect: 'sqlite'`
- **Synchronisation** : `sequelize.sync({ alter: true })` au démarrage
- **Tests** : BDD en mémoire (`:memory:`) via `process.env.DB_STORAGE`
- **Logs SQL** : désactivés (`logging: false`) pour ne pas polluer la console

### 4.4 Modèles de données

#### User

| Colonne     | Type    | Contraintes              |
|-------------|---------|--------------------------|
| id          | INTEGER | PK, auto-increment       |
| email       | STRING  | NOT NULL, UNIQUE, isEmail|
| password    | STRING  | NOT NULL (haché bcrypt)  |
| createdAt   | DATE    | Sequelize auto           |
| updatedAt   | DATE    | Sequelize auto           |

#### Task

| Colonne     | Type                              | Contraintes              |
|-------------|-----------------------------------|--------------------------|
| id          | INTEGER                           | PK, auto-increment       |
| title       | STRING                            | NOT NULL                 |
| description | TEXT                              | Nullable                 |
| status      | ENUM('A faire','En cours','Terminé') | DEFAULT 'A faire'     |
| UserId      | INTEGER                           | FK → Users.id            |
| createdAt   | DATE                              | Sequelize auto           |
| updatedAt   | DATE                              | Sequelize auto           |

#### Relation

```
User  1 ──────< Task  (onDelete: CASCADE)
```

Un utilisateur peut avoir plusieurs tâches. La suppression d'un utilisateur entraîne la suppression en cascade de toutes ses tâches.

### 4.5 API REST — Référence des endpoints

#### Health check

| Méthode | Route         | Auth | Description              |
|---------|---------------|------|--------------------------|
| GET     | /api/health   | Non  | Vérifie que l'API répond |

**Réponse 200 :**
```json
{ "status": "success", "message": "API opérationnelle." }
```

---

#### Authentification (`/api/auth`)

Les deux routes sont soumises au rate limiter : **10 requêtes / 15 minutes par IP**.

##### POST /api/auth/register

Crée un nouvel utilisateur.

**Body :**
```json
{ "email": "user@example.com", "password": "monMotDePasse" }
```

| Code | Cas                                |
|------|------------------------------------|
| 201  | Utilisateur créé                   |
| 400  | Champ manquant                     |
| 409  | Email déjà utilisé                 |
| 429  | Trop de tentatives (rate limit)    |

**Réponse 201 :**
```json
{ "message": "Utilisateur créé avec succès.", "userId": 1 }
```

##### POST /api/auth/login

Authentifie un utilisateur et retourne un JWT.

**Body :**
```json
{ "email": "user@example.com", "password": "monMotDePasse" }
```

| Code | Cas                                |
|------|------------------------------------|
| 200  | Connexion réussie                  |
| 400  | Champ manquant                     |
| 401  | Identifiants incorrects            |
| 429  | Trop de tentatives (rate limit)    |

**Réponse 200 :**
```json
{ "message": "Connexion réussie.", "token": "<JWT>" }
```

Le token a une durée de vie de **2 heures**.

---

#### Tâches (`/api/tasks`) — Toutes les routes requièrent un JWT valide

Le token doit être transmis dans le header HTTP :
```
Authorization: Bearer <token>
```

##### GET /api/tasks

Retourne uniquement les tâches appartenant à l'utilisateur connecté.

**Réponse 200 :**
```json
[
  {
    "id": 1,
    "title": "Ma tâche",
    "description": "Description",
    "status": "A faire",
    "UserId": 1,
    "createdAt": "...",
    "updatedAt": "..."
  }
]
```

##### POST /api/tasks

Crée une nouvelle tâche liée à l'utilisateur connecté.

**Body :**
```json
{ "title": "Titre de la tâche", "description": "Description optionnelle" }
```

| Code | Cas                      |
|------|--------------------------|
| 201  | Tâche créée              |
| 400  | Titre manquant           |
| 401  | Token manquant           |
| 403  | Token invalide/expiré    |

##### PUT /api/tasks/:id

Modifie une tâche existante. Vérifie que la tâche appartient à l'utilisateur connecté.

**Body (tout ou partie) :**
```json
{ "title": "Nouveau titre", "description": "...", "status": "En cours" }
```

| Code | Cas                              |
|------|----------------------------------|
| 200  | Tâche mise à jour                |
| 403  | Tâche appartenant à un autre user|
| 404  | Tâche non trouvée                |

##### DELETE /api/tasks/:id

Supprime une tâche. Vérifie la propriété avant suppression.

| Code | Cas                              |
|------|----------------------------------|
| 200  | Tâche supprimée                  |
| 403  | Tâche appartenant à un autre user|
| 404  | Tâche non trouvée                |

**Cycle de statuts côté frontend :**
```
A faire → En cours → Terminé → A faire → ...
```

### 4.6 Middleware d'authentification

`backend/middleware/auth.js` intercepte chaque requête sur les routes protégées :

1. Extrait le token du header `Authorization: Bearer <token>`
2. Retourne `401` si le token est absent
3. Vérifie la signature et l'expiration avec `jwt.verify()`
4. Retourne `403` si le token est invalide ou expiré
5. Injecte le payload décodé dans `req.user` (contient `id` et `email`)

### 4.7 Sécurité

| Mesure                        | Implémentation                                      | Référence  |
|-------------------------------|-----------------------------------------------------|------------|
| Hachage des mots de passe     | bcrypt, 10 passes de salage                         | OWASP      |
| Authentification stateless    | JWT signé, expiration 2h                            | OWASP      |
| Protection brute force        | Rate limiting : 10 req / 15 min / IP sur `/api/auth`| ANSSI PA-079|
| Headers HTTP sécurisés        | `helmet()` (CSP, HSTS, X-Frame-Options, etc.)       | OWASP      |
| Isolation des données         | Filtre `UserId` sur toutes les requêtes de tâches   | OWASP A01  |
| Contrôle de propriété         | Vérification `task.UserId === req.user.id`          | OWASP A01  |
| Anti-énumération              | Message d'erreur générique sur les échecs de login  | OWASP      |
| CORS restrictif               | Autorisé uniquement depuis `http://localhost:5173`  |            |
| Trust proxy                   | `app.set('trust proxy', 1)` pour IP réelle derrière proxy |    |

---

## 5. Frontend

### 5.1 Stack technique

| Package              | Version  | Rôle                              |
|----------------------|----------|-----------------------------------|
| react                | ^19.2.6  | Bibliothèque UI                   |
| react-dom            | ^19.2.6  | Rendu DOM                         |
| react-router-dom     | ^7.18.0  | Routing SPA                       |
| axios                | ^1.18.0  | Client HTTP                       |
| vite                 | ^8.0.12  | Bundler et serveur de dev         |

### 5.2 Configuration et démarrage

Vite sert le frontend sur le port **5173** en développement. L'URL de l'API backend est définie en dur dans `src/api/axios.js` (`http://localhost:5000/api`).

### 5.3 Routing et protection des routes

`src/App.jsx` définit trois routes :

| Route        | Composant         | Accès     |
|--------------|-------------------|-----------|
| `/login`     | `<Login />`       | Public    |
| `/register`  | `<Register />`    | Public    |
| `/dashboard` | `<Dashboard />`   | Protégé   |
| `*`          | Redirige vers `/login` | —    |

**`ProtectedRoute`** vérifie l'état `isAuthenticated` du contexte. Si l'utilisateur n'est pas authentifié, il est redirigé automatiquement vers `/login`.

### 5.4 Gestion de l'authentification (AuthContext)

`src/context/AuthContext.jsx` expose via React Context :

| Valeur            | Type     | Description                              |
|-------------------|----------|------------------------------------------|
| `token`           | string   | JWT stocké en localStorage               |
| `isAuthenticated` | boolean  | `true` si un token est présent           |
| `login(token)`    | function | Stocke le token et met à jour l'état     |
| `logout()`        | function | Supprime le token et déconnecte          |

Le token est persisté dans `localStorage` et restauré au rechargement de page.

### 5.5 Client HTTP (Axios)

`src/api/axios.js` crée une instance Axios configurée :

- **baseURL** : `http://localhost:5000/api`
- **timeout** : 5 000 ms
- **Intercepteur request** : attache automatiquement le header `Authorization: Bearer <token>` si un token est présent en localStorage

### 5.6 Pages et composants

#### Pages

| Fichier              | Description                                              |
|----------------------|----------------------------------------------------------|
| `Login.jsx`          | Formulaire de connexion, appel POST `/api/auth/login`    |
| `Register.jsx`       | Formulaire d'inscription, appel POST `/api/auth/register`|
| `Dashboard.jsx`      | Interface CRUD des tâches + statistiques + WeatherWidget |

**Dashboard — fonctionnalités :**
- Chargement des tâches au montage (`GET /api/tasks`)
- Création via formulaire (`POST /api/tasks`)
- Changement de statut cyclique : `A faire → En cours → Terminé → A faire`
- Suppression (`DELETE /api/tasks/:id`)
- Affichage des statistiques dynamiques (total, à faire, en cours, terminées)
- Extraction de l'email utilisateur depuis le payload JWT (décodage base64)

#### Composants

| Fichier              | Description                                              |
|----------------------|----------------------------------------------------------|
| `ProtectedRoute.jsx` | Guard : redirige si non authentifié                      |
| `TaskModal.jsx`      | Modale affichant le détail d'une tâche (titre, description, statut, actions)|
| `WeatherWidget.jsx`  | Widget météo avec recherche de ville                     |

**WeatherWidget — fonctionnement :**

1. Au montage, tente d'obtenir la position GPS de l'utilisateur via `navigator.geolocation`
2. Géocode la position avec l'API Nominatim (OpenStreetMap) pour obtenir le nom de la ville
3. Interroge l'API **Open-Meteo** pour les données météo en temps réel (température, ressenti, humidité, vent, précipitations, code météo WMO)
4. L'utilisateur peut rechercher n'importe quelle ville via un champ de recherche (autocomplétion via Open-Meteo Geocoding API)
5. En cas de refus de géolocalisation : Paris par défaut

**APIs externes utilisées :**

| API                             | Données                        | Authentification |
|---------------------------------|--------------------------------|------------------|
| `api.open-meteo.com`            | Météo temps réel               | Aucune (publique)|
| `geocoding-api.open-meteo.com`  | Recherche de ville par nom     | Aucune (publique)|
| `nominatim.openstreetmap.org`   | Géocodage inverse (GPS → ville)| Aucune (publique)|

---

## 6. Tests

Les tests sont des tests d'**intégration** côté backend, utilisant une base de données SQLite **en mémoire** pour l'isolation.

### Configuration (`jest.config.js`)

```js
{
  testEnvironment: 'node',
  setupFiles: ['./tests/setup.js'],   // Injecte JWT_SECRET et DB_STORAGE=':memory:'
  testMatch: ['**/tests/**/*.test.js'],
  runInBand: true,                    // Tests séquentiels (important pour SQLite)
  forceExit: true,
  verbose: true
}
```

### Lancer les tests

```bash
cd backend
npm test
```

### Couverture

| Fichier de test      | Cas testés                                                         |
|----------------------|--------------------------------------------------------------------|
| `auth.test.js`       | Register (succès, email dupliqué, champs manquants), Login (succès, mauvais mdp, rate limit) |
| `tasks.test.js`      | CRUD complet (create, read, update status, delete), isolation entre utilisateurs, accès non autorisé |

---

## 7. Flux applicatif complet

### Inscription

```
Frontend           Backend               BDD
   │                  │                   │
   │── POST /register ──►                 │
   │   { email, pwd }  │                  │
   │                  ├── User.findOne ──►│
   │                  │◄── null ──────────│
   │                  ├── bcrypt.hash()   │
   │                  ├── User.create ───►│
   │◄── 201 { userId } │                  │
```

### Connexion

```
Frontend           Backend               BDD
   │                  │                   │
   │── POST /login ───►                   │
   │   { email, pwd }  │                  │
   │                  ├── User.findOne ──►│
   │                  │◄── User ──────────│
   │                  ├── bcrypt.compare()│
   │                  ├── jwt.sign()      │
   │◄── 200 { token }  │                  │
   │                  │                   │
   │ localStorage.setItem('token', ...)   │
```

### Accès au dashboard (requête protégée)

```
Frontend           Backend               BDD
   │                  │                   │
   │── GET /tasks ────►                   │
   │   Authorization: Bearer <JWT>        │
   │                  ├── jwt.verify()    │
   │                  ├── Task.findAll ──►│
   │                  │   where UserId=X  │
   │◄── 200 [tasks]   │◄── [tasks] ───────│
```

---

## 8. Variables d'environnement

Le fichier `backend/.env` (non versionné) doit contenir :

| Variable     | Description                              | Exemple                       |
|--------------|------------------------------------------|-------------------------------|
| `PORT`       | Port du serveur Express                  | `5000`                        |
| `JWT_SECRET` | Clé secrète pour signer les JWT          | `une_clé_aléatoire_longue`    |
| `DB_STORAGE` | Chemin du fichier SQLite                 | `./database.sqlite`           |

**Pour les tests**, `backend/tests/setup.js` injecte automatiquement :
```js
process.env.JWT_SECRET = 'test-secret-key-jest';
process.env.DB_STORAGE = ':memory:';
```

---

## 9. Lancer le projet en local

### Prérequis

- Node.js ≥ 18
- npm

### Backend

```bash
cd backend

# Installer les dépendances
npm install

# Créer le fichier .env
echo "PORT=5000" > .env
echo "JWT_SECRET=votre_secret_jwt_ici" >> .env
echo "DB_STORAGE=./database.sqlite" >> .env

# Démarrer en mode développement (avec rechargement automatique)
npm run dev

# Ou en production
npm start
```

Le serveur écoute sur `http://localhost:5000`.

### Frontend

```bash
cd frontend

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

L'application est accessible sur `http://localhost:5173`.

### Tests

```bash
cd backend
npm test
```

### Vérification rapide

```bash
curl http://localhost:5000/api/health
# {"status":"success","message":"API opérationnelle."}
```
