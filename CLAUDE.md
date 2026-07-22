# HeroQuest Heroes — CLAUDE.md

Application de gestion des héros pour parties de HeroQuest (édition MB 1990).
Monorepo avec un backend Spring Boot et un frontend Angular.

---

## Architecture

```
heroquestHeroes/
├── backend/          Spring Boot 3.4.3 — Java 21 — Maven
└── frontend/
    └── HQHeroesClient/   Angular 21 — Angular Material 21
```

---

## Backend

### Lancer

```bash
cd backend
./mvnw spring-boot:run
# ou profil local :
./mvnw spring-boot:run -Dspring-boot.run.profiles=local
```

- Port : **8029**
- Context path : `/HQHeroes`
- Base URL API : `http://localhost:8029/HQHeroes/api/v1`
- Swagger UI : `http://localhost:8029/HQHeroes/swagger-ui.html`

### Stack

| Composant | Détail |
|---|---|
| Spring Boot | 3.4.3 |
| Java | 21 |
| Base de données | MongoDB (Spring Data) |
| Migrations | Mongock 5.4.4 — scan package `fr.rectus29.heroquestheroes.migration` |
| Sécurité | Spring Security — CSRF désactivé — CORS global via `WebMvcConfigurer` (autorise `http://localhost:4200`) |
| Sérialisation | Jackson — `NON_NULL` — `FAIL_ON_UNKNOWN_PROPERTIES` désactivé — `ObjectId` sérialisé en String |
| Docs | springdoc-openapi 2.3.0 |

### Package structure

```
fr.rectus29.heroquestheroes
├── controllers/
│   ├── HeroController.java        GET/POST/PUT/DELETE /api/v1/heroes
│   ├── QuestController.java       GET /api/v1/quest
│   ├── EquipmentController.java   GET /api/v1/equipments (filtres category, source)
│   ├── GameSessionController.java /api/v1/sessions — cycle de vie d'une partie
│   └── AdminController.java       /api/v1/admin — stub vide (pas d'endpoint)
├── dto/
│   ├── HeroDTO.java                 réponse héros (inclut resolvedAttackPoints, resolvedDefencePoints)
│   ├── HeroUpdateRequest.java       corps PUT héros
│   ├── QuestDTO.java                réponse quête (from Quest enum)
│   ├── EquipmentDTO.java            réponse équipement (from Equipment enum)
│   ├── GameSessionDTO.java          réponse partie (displayName calculé + heroStates)
│   ├── CreateSessionRequest.java    corps POST session (heroIds, questId?, name?)
│   └── UpdateSessionStateRequest.java  corps PUT /state (heroStates)
├── enums/
│   ├── HeroClass.java            BARBARE | ELFE | NAIN | ENCHANTEUR (stats de base)
│   ├── Quest.java                14 quêtes du livre de base (number, title, briefing, goldRewardPerHero, rewardNotes)
│   ├── Equipment.java            21 équipements (nested Category, Source, ApplyMode)
│   └── MonsterType.java          9 types de monstres (non exposé par API)
├── model/
│   ├── GenericEntity.java        base — ObjectId _id, creationInstant, updateInstant
│   ├── Hero.java                 @Document("heroes") — name (unique), heroClass, stats, goldEntries, equipements, comment, completedQuests
│   ├── GameSession.java          @Document("game_sessions") — name?, questId?, heroIds, heroStates, status (nested Status enum + HeroSessionState)
│   ├── Stuff.java                équipement porté par un héros (equipment, attributesList) — factory Stuff.from(Equipment)
│   └── GoldEntry.java            entrée d'or (amount)
├── services/
│   ├── HeroService.java          findAll, findOneById, save, deleteById
│   └── GameSessionService.java   create, findAll, findById, updateState, end, abandon
├── repository/
│   ├── HeroRepository.java        MongoRepository<Hero, ObjectId> (findByName, findAllByHeroClass)
│   └── GameSessionRepository.java MongoRepository<GameSession, ObjectId> (findByStatus)
├── migration/
│   └── InitialSetupMigration.java  Mongock — index unique sur heroes.name (@ChangeUnit actuellement commenté → inactif)
├── utils/
│   └── HeroUtils.java            resolveAttackPoint / resolveDefencePoint (somme des attributs d'équipement)
├── dbInit.java                     @Component — crée l'index unique heroes.name au démarrage (@PostConstruct)
├── HeroquestHeroesConfiguration.java  Security + CORS + @EnableScheduling
└── JacksonMapperConfiguration.java    ObjectId serializer, NON_NULL, ignore unknown
```

### Conventions Java

- Entités Lombok : `@Getter @Setter @EqualsAndHashCode(callSuper=true) @Accessors(chain=true)`
- DTOs Lombok : `@Data @Accessors(chain=true)`
- Les enums de catalogue (Quest, Equipment) ont leurs propres getters manuels — ne pas ajouter `@Data`
- Jackson sérialise les enums par leur **nom** (`.name()`) — le front envoie/reçoit des strings comme `"Q01"`, `"BARBARE"`
- `HeroDTO.from(Hero)` est le seul point de mapping model → DTO
- `resolvedAttackPoints` et `resolvedDefencePoints` = valeurs de base + somme des modificateurs des `Stuff` équipés

### Endpoints

| Méthode | URL | Description |
|---|---|---|
| GET | `/api/v1/heroes` | Liste tous les héros |
| POST | `/api/v1/heroes` | Crée un héros (body : `Hero` brut) |
| GET | `/api/v1/heroes/{id}` | Détail d'un héros |
| PUT | `/api/v1/heroes/{id}` | Met à jour un héros (body : `HeroUpdateRequest`) |
| DELETE | `/api/v1/heroes/{id}` | Supprime un héros |
| GET | `/api/v1/quest` | Liste les 14 quêtes (`QuestDTO[]`) |
| GET | `/api/v1/equipments` | Liste le catalogue d'équipement (`EquipmentDTO[]`, filtres `category`, `source`) |
| POST | `/api/v1/sessions` | Crée une partie (body : `CreateSessionRequest`), init `currentHp`/`currentSp` |
| GET | `/api/v1/sessions` | Liste les parties (filtre `status`) |
| GET | `/api/v1/sessions/{id}` | Détail d'une partie (`GameSessionDTO`) |
| PUT | `/api/v1/sessions/{id}/state` | Auto-save de l'état (body : `UpdateSessionStateRequest`) |
| POST | `/api/v1/sessions/{id}/end` | Fin de quête : engage or + équipements + `completedQuests` sur chaque héros → `ENDED` |
| POST | `/api/v1/sessions/{id}/abandon` | Abandonne la partie → `ABANDONED` (aucun impact héros) |

---

## Frontend

### Lancer

```bash
cd frontend/HQHeroesClient
npm install
npm start        # ng serve — http://localhost:4200
```

### Stack

| Composant | Détail |
|---|---|
| Angular | 21 (standalone components, Signals) |
| Angular Material | 21 (Material Design 3, thème sombre) |
| Formulaires | `FormsModule` (template-driven, `ngModel`) |
| HTTP | `HttpClient` via `inject()` |
| Tests | Vitest |

### Structure

```
src/app/
├── components/
│   ├── hero-list/        liste des héros + parties en cours (reprise) — page d'accueil
│   ├── hero-create/      formulaire de création
│   ├── hero-detail/      consultation + édition d'un héros
│   ├── hero-card/        carte héros réutilisable (input hero/liveState, flag readonly, outputs actions)
│   ├── game-setup/       préparation d'une partie (choix héros + quête) + reprise
│   ├── game-board/       plateau du Maître du Jeu — suivi PV/PE, or, équipements, auto-save
│   └── player-view/      vue joueur lecture seule — /game/view/:id, polling 5s
├── models/
│   ├── hero.model.ts     HeroDTO, HeroCreateRequest, HeroUpdateRequest, StuffDTO, GameSessionDTO, HeroSessionStateDTO, EquipmentCatalogDTO
│   ├── hero-class.enum.ts  HERO_CLASS_INFO (label, color, icon par classe)
│   └── base-quest-book.ts  interface QuestBookEntry (plus de constantes hardcodées — vient du backend)
├── services/
│   ├── hero.service.ts         CRUD héros — baseUrl http://localhost:8029/HQHeroes/api/v1/heroes
│   ├── quest-book.service.ts   getAll() — .../api/v1/quest
│   ├── equipment.service.ts    getAll() — .../api/v1/equipments
│   └── game-session.service.ts create, load, refresh, listActive, end, abandon, autoSave — .../api/v1/sessions (signals réactifs)
└── app.routes.ts
    # '' → /heroes
    # /heroes → HeroList
    # /heroes/new → HeroCreate          ← doit être AVANT /heroes/:id
    # /heroes/:id → HeroDetail
    # /game → GameSetup
    # /game/board/:sessionId → GameBoard  (Maître du Jeu)
    # /game/view/:sessionId → PlayerView  (Joueurs — lecture seule)
```

### Conventions Angular

- Composants standalone, pas de NgModule
- État géré avec `signal()` — lecture dans le template avec `hero()`, `allQuests()`, etc.
- Injection via `inject()` (pas de constructeur)
- Les IDs héros viennent de MongoDB comme `ObjectId.toString()` — traités comme `string` côté front
- `completedQuests: string[]` dans `HeroDTO` — valeurs = noms d'enum Java (`"Q01"`, `"Q14"`)

### Thème visuel

- Police titres : **Cinzel** / **Cinzel Decorative** (Google Fonts)
- Police corps : **IM Fell English**
- Variables CSS clés : `--hq-gold: #c9a84c`, `--hq-parchment: #e8d5a0`, `--hq-stone: #0a0806`
- Thème Angular Material : dark, palette orange, défini dans `src/material-theme.scss`
- Largeur max des pages : **1200px**

---

## Modèle de données clés

### HeroClass (valeurs de base)

| Classe | PV | PE | ATK | DEF |
|---|---|---|---|---|
| BARBARE | 8 | 2 | 3 | 2 |
| ELFE | 6 | 4 | 2 | 2 |
| NAIN | 6 | 4 | 2 | 2 |
| ENCHANTEUR | 4 | 6 | 1 | 2 |

### Equipment — catégories

- `ARME` — modificateur `attackMod`
- `ARMURE` — modificateur `defenceMod`
- `POTION` — modificateur `healthMod` ou `spiritMod` (usage unique en jeu)
- `SORT` — modificateur variable
- `AMULETTE` — effet spécial (pas de modificateur numérique)

Sources : `ARMURERIE` (achat entre quêtes) | `RECOMPENSE_QUETE` (butin de quête)

---

## Notes importantes

- `dbInit.java` à la racine crée l'index unique `heroes.name` au démarrage. Le `@ChangeUnit` de `InitialSetupMigration` est **actuellement commenté** (migration Mongock inactive) — c'est donc `dbInit` qui assure l'index
- Le profil `local` (`application-local.yml`) permet de surcharger la config MongoDB pour le dev
- `QuestController` (ex-`QuestBookController`) : le fichier s'appelle `QuestController.java`, mapping `/api/v1/quest`
- `Equipment.java` est un enum catalogue désormais **exposé par API** (`EquipmentController` → `/api/v1/equipments`) et **lié à `Stuff`** via la factory `Stuff.from(Equipment)` (peuple `attributesList` depuis attackMod/defenceMod/healthMod/spiritMod)
- **Sessions de jeu** : `GameSession` (`@Document("game_sessions")`) porte l'état live d'une partie via `heroStates` (currentHp/currentSp + `pendingGoldEntries`/`pendingEquipements`). Les PV/PE persistés du héros ne bougent **pas** en cours de partie — seul `POST /sessions/{id}/end` engage les gains sur les héros. Specs de conception dans `docs/superpowers/specs/`
- `AdminController` (`/api/v1/admin`) est un stub vide (aucun endpoint pour l'instant)
- `MonsterType` est un enum catalogue non exposé par API (prévu pour évolution future)