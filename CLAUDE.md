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
│   ├── HeroController.java       GET/POST/PUT/DELETE /api/v1/heroes
│   └── QuestController.java      GET /api/v1/quest
├── dto/
│   ├── HeroDTO.java              réponse héros (inclut resolvedAttackPoints, resolvedDefencePoints)
│   ├── HeroUpdateRequest.java    corps PUT héros
│   └── QuestDTO.java             réponse quête (from Quest enum)
├── enums/
│   ├── HeroClass.java            BARBARE | ELFE | NAIN | ENCHANTEUR (stats de base)
│   ├── Quest.java                14 quêtes du livre de base (number, title, briefing, goldRewardPerHero, rewardNotes)
│   ├── Equipment.java            21 équipements (armurerie + récompenses quêtes)
│   └── MonsterType.java          9 types de monstres
├── model/
│   ├── GenericEntity.java        base — ObjectId _id
│   ├── Hero.java                 @Document("heroes") — name (unique), heroClass, stats, goldEntries, equipements, comment, completedQuests
│   ├── Stuff.java                équipement porté par un héros (name, desc, attributesList)
│   └── GoldEntry.java            entrée d'or (amount)
├── services/
│   └── HeroService.java          findAll, findOneById, save, deleteById
├── repository/
│   └── HeroRepository.java       MongoRepository<Hero, ObjectId>
├── migration/
│   └── InitialSetupMigration.java  Mongock — index unique sur heroes.name
├── utils/
│   └── HeroUtils.java            resolveAttackPoint / resolveDefencePoint (somme des attributs d'équipement)
├── HeroquestHeroesConfiguration.java  Security + CORS WebMvcConfigurer
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
│   ├── hero-list/        liste des héros — page d'accueil
│   ├── hero-create/      formulaire de création
│   └── hero-detail/      consultation + édition d'un héros
├── models/
│   ├── hero.model.ts     HeroDTO, HeroUpdateRequest, StuffDTO, StuffAttributeDTO
│   ├── hero-class.enum.ts  HERO_CLASS_INFO (label, color, icon par classe)
│   └── base-quest-book.ts  interface QuestBookEntry (plus de constantes hardcodées — vient du backend)
├── services/
│   ├── hero.service.ts       CRUD héros — baseUrl http://localhost:8029/HQHeroes/api/v1/heroes
│   └── quest-book.service.ts getAll() — http://localhost:8029/HQHeroes/api/v1/quest
└── app.routes.ts
    # '' → /heroes
    # /heroes → HeroList
    # /heroes/new → HeroCreate   ← doit être AVANT /heroes/:id
    # /heroes/:id → HeroDetail
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

- `dbInit.java` à la racine crée le même index unique que la migration Mongock — redondant, peut être supprimé une fois Mongock exécuté
- Le profil `local` (`application-local.yml`) permet de surcharger la config MongoDB pour le dev
- `QuestController` (ex-`QuestBookController`) : le fichier s'appelle `QuestController.java`, mapping `/api/v1/quest`
- `Equipment.java` est un enum catalogue — non encore lié à `Stuff.java` ni exposé par API, prévu pour évolution future