# HeroQuest Heroes

Application web de gestion des héros pour les parties de **HeroQuest** (édition originale MB, 1990).
Gardez une trace de vos aventuriers entre les quêtes : statistiques, équipement, or accumulé et progression dans le livre de quêtes.

---

## Fonctionnalités

### Gestion des héros

- **Créer** un héros en choisissant sa classe (Barbare, Elfe, Nain, Enchanteur)
- **Consulter** sa fiche : points de vie, points d'esprit, attaque, défense, or, équipement et quêtes accomplies
- **Modifier** ses statistiques, ses notes et les quêtes terminées via un formulaire d'édition
- **Supprimer** un héros en fin de campagne
- Calcul automatique des points d'attaque et de défense **résolus** en tenant compte des bonus d'équipement

### Parties de jeu

- **Lancer une partie** : choisir les héros participants et une quête (ou partie libre)
- **Plateau de suivi en direct** : points de vie / d'esprit, or ramassé et équipements trouvés pendant la quête, avec **auto-sauvegarde** continue côté serveur
- **Reprendre une partie** depuis n'importe quel appareil ou onglet — les parties en cours sont listées sur la page d'accueil
- **Fin de quête** : l'or, les équipements ramassés et la quête accomplie sont automatiquement engagés sur chaque héros ; possibilité d'**abandonner** une partie sans impact
- **Vue joueur** en lecture seule via un lien partageable, rafraîchie automatiquement (polling) — chaque joueur suit l'état de son héros sur son propre écran
- **Catalogue d'équipement** (armes, armures, potions, sorts, amulettes) exposé par l'API et filtrable par catégorie / source

---

## Stack technique

| Couche | Technologie |
|---|---|
| Backend | Spring Boot 3.4.3 — Java 21 — Maven |
| Base de données | MongoDB |
| Migrations BDD | Mongock 5.4.4 |
| Frontend | Angular 21 (standalone components, Signals) |
| UI | Angular Material 21 — thème sombre personnalisé |
| Tests front | Vitest |
| API | REST JSON — port 8029 |
| Docs API | springdoc-openapi 2.3.0 (Swagger UI) |

---

## Lancer l'application

### Prérequis

- Java 21+
- Node.js 20+ / npm 10+
- MongoDB accessible (configurer dans `application-local.yml`)

### Backend

```bash
cd backend
./mvnw spring-boot:run
```

L'API démarre sur **http://localhost:8029/HQHeroes**
Documentation Swagger : http://localhost:8029/HQHeroes/swagger-ui.html

### Frontend

```bash
cd frontend/HQHeroesClient
npm install
npm start
```

L'interface est accessible sur **http://localhost:4200**

---

## Structure du projet

```
heroquestHeroes/
├── backend/                  API Spring Boot
│   └── src/main/java/
│       └── fr/rectus29/heroquestheroes/
│           ├── controllers/  HeroController, QuestController, EquipmentController, GameSessionController
│           ├── dto/          HeroDTO, HeroUpdateRequest, QuestDTO, EquipmentDTO,
│           │                 GameSessionDTO, CreateSessionRequest, UpdateSessionStateRequest
│           ├── enums/        HeroClass, Quest, Equipment, MonsterType
│           ├── model/        Hero, GameSession, Stuff, GoldEntry
│           ├── services/     HeroService, GameSessionService
│           ├── repository/   HeroRepository, GameSessionRepository
│           ├── utils/        HeroUtils — calcul des points résolus
│           └── migration/    Mongock — index unique sur le nom du héros
└── frontend/HQHeroesClient/  Client Angular
    └── src/app/
        ├── components/       hero-list, hero-create, hero-detail,
        │                     hero-card, game-setup, game-board, player-view
        ├── models/           interfaces TypeScript (hero, session, équipement, quêtes)
        └── services/         HeroService, QuestBookService, GameSessionService, EquipmentService
```

---

## API REST

Base : `http://localhost:8029/HQHeroes/api/v1`

| Méthode | URL | Description |
|---|---|---|
| `GET` | `/heroes` | Liste tous les héros |
| `POST` | `/heroes` | Crée un héros |
| `GET` | `/heroes/{id}` | Détail d'un héros |
| `PUT` | `/heroes/{id}` | Met à jour un héros |
| `DELETE` | `/heroes/{id}` | Supprime un héros |
| `GET` | `/quest` | Liste les 14 quêtes du livre de base |
| `GET` | `/equipments` | Liste le catalogue d'équipement (filtres `category`, `source`) |
| `POST` | `/sessions` | Crée une partie (héros + quête optionnelle) |
| `GET` | `/sessions` | Liste les parties (filtre `status`) |
| `GET` | `/sessions/{id}` | Détail d'une partie |
| `PUT` | `/sessions/{id}/state` | Auto-sauvegarde de l'état en jeu (PV/PE, or et équipements en attente) |
| `POST` | `/sessions/{id}/end` | Termine la quête et engage les gains sur les héros |
| `POST` | `/sessions/{id}/abandon` | Abandonne la partie (aucun impact sur les héros) |

---

## Catalogue de données

### Classes de héros

| Classe | Points de Vie | Points d'Esprit | Attaque | Défense |
|---|:---:|:---:|:---:|:---:|
| Barbare | 8 | 2 | 3 | 2 |
| Elfe | 6 | 4 | 2 | 2 |
| Nain | 6 | 4 | 2 | 2 |
| Enchanteur | 4 | 6 | 1 | 2 |

### Quêtes du livre de base

14 quêtes incluses, de *L'Initiation* (Q01) au *Seigneur du Mal* (Q14), avec récompenses en or et objets spéciaux.

### Équipements

21 objets référencés : armes, armures, potions, sorts et amulettes.
Disponibles à l'armurerie ou obtenus comme récompenses de quêtes.

---

## Captures d'écran

> *À venir*

---

## Auteur

Alexandre — [rectus29](https://github.com/rectus29)