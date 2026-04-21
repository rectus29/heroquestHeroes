# Game Session Persistence — Design Spec
**Date:** 2026-04-21  
**Scope:** Persister l'état d'une partie en cours pour permettre la reprise sur n'importe quel appareil, survivre aux refreshs et gérer plusieurs parties simultanées.

---

## 1. Objectif

Remplacer le `GameSessionService` Angular purement en mémoire par une persistance backend complète. Chaque partie obtient un identifiant unique. Les HP/PE et les acquisitions en cours de partie (or, équipements) sont auto-sauvegardés en continu. Une partie peut être reprise depuis n'importe quel appareil ou onglet.

---

## 2. Modèle de données

### `GameSession` — document MongoDB (`game_sessions`)

Étend `GenericEntity` (id ObjectId, creationInstant, updateInstant).

| Champ | Type | Description |
|---|---|---|
| `name` | `String \| null` | Nom saisi par le joueur. Si null, affiché comme `"Q03 — 21/04/2026"` ou `"Partie libre — 21/04/2026"` |
| `questId` | `String \| null` | Nom de l'enum `Quest` (ex. `"Q03"`), null si partie libre |
| `heroIds` | `List<String>` | IDs MongoDB des héros participants |
| `heroStates` | `List<HeroSessionState>` | État live de chaque héros (objet embarqué) |
| `status` | `Status` | `IN_PROGRESS` \| `ENDED` \| `ABANDONED` |

### `HeroSessionState` — objet embarqué (inner static class de `GameSession`)

| Champ | Type | Description |
|---|---|---|
| `heroId` | `String` | ID du héros |
| `currentHp` | `int` | PV actuels (peut différer du `healthPoints` persisté du héros) |
| `currentSp` | `int` | PE actuels |
| `pendingGoldEntries` | `List<GoldEntry>` | Entrées d'or accumulées pendant la partie, non encore engagées |
| `pendingEquipements` | `List<Equipment>` | Équipements trouvés pendant la partie, non encore engagés |

### Nom affiché (calculé dans le DTO)

```
name != null  →  name
questId != null  →  "<Quest.number> — <dd/MM/yyyy>"
sinon  →  "Partie libre — <dd/MM/yyyy>"
```

---

## 3. Backend

### Nouveaux fichiers

```
model/GameSession.java              @Document("game_sessions")
dto/GameSessionDTO.java             inclut displayName calculé + heroStates
dto/CreateSessionRequest.java       heroIds, questId?, name?
repository/GameSessionRepository.java  + findByStatus(Status)
services/GameSessionService.java    create, findAll, findById, updateState, end, abandon
controllers/GameSessionController.java  /api/v1/sessions
```

### Endpoints

| Méthode | URL | Corps / Paramètres | Description |
|---|---|---|---|
| `POST` | `/api/v1/sessions` | `{ heroIds, questId?, name? }` | Crée une session IN_PROGRESS, initialise `currentHp`/`currentSp` depuis les stats du héros |
| `GET` | `/api/v1/sessions` | `?status=IN_PROGRESS` (optionnel) | Liste les sessions |
| `GET` | `/api/v1/sessions/{id}` | — | Détail complet d'une session |
| `PUT` | `/api/v1/sessions/{id}/state` | `{ heroStates }` | Auto-save — met à jour `heroStates` + `updateInstant` uniquement |
| `POST` | `/api/v1/sessions/{id}/end` | — | Fin de quête : engage gold + équipements + `completedQuests` sur chaque héros, passe `status` à `ENDED` |
| `POST` | `/api/v1/sessions/{id}/abandon` | — | Passe `status` à `ABANDONED`, aucun changement sur les héros |

### Logique `end`

Le `POST /end` remplace le `forkJoin` actuellement dans le `GameBoard` Angular :
1. Pour chaque héros de la session :
   - Ajoute `pendingGoldEntries` à `hero.goldEntries`
   - Si `quest.goldRewardPerHero > 0` → ajoute une entrée "Récompense — {title}"
   - Convertit chaque `Equipment` de `pendingEquipements` en `Stuff` via une méthode factory `Stuff.from(Equipment)` qui peuple `attributesList` depuis les modificateurs de l'enum (attackMod, defenceMod, healthMod, spiritMod), puis ajoute le résultat à `hero.equipements`
   - Ajoute `questId` à `hero.completedQuests` si pas déjà présent
2. Sauvegarde chaque héros
3. Passe `session.status` à `ENDED`

---

## 4. Frontend

### Route modifiée

```
/game/board  →  /game/board/:sessionId
```

### `GameSessionService` (Angular) — refonte

Le service garde des signals Angular pour la réactivité locale, alimentés depuis l'API.

| Méthode | Appel API | Description |
|---|---|---|
| `create(heroIds, questId?, name?)` | `POST /sessions` | Crée la session, alimente les signals, navigate vers `/game/board/:id` |
| `load(sessionId)` | `GET /sessions/:id` | Charge une session existante, alimente les signals |
| `autoSave(sessionId, heroStates)` | `PUT /sessions/:id/state` | Debounce 800ms |
| `end(sessionId)` | `POST /sessions/:id/end` | Fin de quête |
| `abandon(sessionId)` | `POST /sessions/:id/abandon` | Abandon |
| `listActive()` | `GET /sessions?status=IN_PROGRESS` | Pour la page de reprise |
| `clear()` | — | Reset signals locaux |

### `GameSetup` — changements

- Au `ngOnInit`, appelle `listActive()` en parallèle du chargement des héros
- Section "Parties en cours" (si résultats) : liste les sessions avec nom, date, avatars des héros participants, bouton "Reprendre" → navigate vers `/game/board/:id`
- Section "Nouvelle partie" : formulaire existant + champ nom optionnel

### `GameBoard` — changements

- Lit `sessionId` depuis `ActivatedRoute`
- `ngOnInit` : appelle `load(sessionId)` — initialise `liveStats` depuis `session.heroStates`
- Chaque `changeHp`, `changeSp`, `addGoldEntry`, `removePendingEntry`, `addEquipement`, `removePendingEquipement` → déclenche `autoSave()` debounced
- `endQuest()` → `sessionService.end(sessionId)` (plus de `forkJoin` local)
- `abandon()` → `sessionService.abandon(sessionId)`
- Nouvelle section par carte héros : liste des `pendingEquipements` avec bouton d'ajout (sélecteur `Equipment` enum)

### `HeroList` — changement mineur

- Au `ngOnInit`, charge `listActive()` en parallèle
- Si au moins une session IN_PROGRESS : bannière discrète "X partie(s) en cours →" avec lien vers `/game`

---

## 5. Gestion des erreurs

- Auto-save : erreur silencieuse avec retry (3 tentatives, backoff 2s). Une icône discrète indique si la dernière sauvegarde a échoué.
- `load(sessionId)` : si session introuvable ou status != IN_PROGRESS → redirect vers `/game` avec message toast.
- `end` / `abandon` : spinner + disable boutons pendant l'appel. En cas d'erreur → message d'erreur, l'utilisateur peut réessayer.

---

## 6. Ce qui ne change pas

- Le modèle `Hero` et ses endpoints existants restent inchangés
- Les HP/PE persistés sur le héros (`hero.healthPoints`, `hero.spiritPoints`) ne sont **pas** mis à jour pendant la partie — seuls `currentHp`/`currentSp` dans `HeroSessionState` bougent
- La logique d'affichage des cartes héros dans `GameBoard` reste identique ; seule la source des données change (session chargée depuis l'API au lieu des signals locaux)