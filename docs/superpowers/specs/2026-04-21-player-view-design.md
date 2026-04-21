# Vue Joueur (Player View) — Design Spec
**Date:** 2026-04-21  
**Scope:** Séparer le game-board en deux interfaces : vue Maître du Jeu (contrôles complets) et vue Joueur (consultation en lecture seule, temps réel via polling).

---

## 1. Objectif

Permettre aux joueurs de suivre l'état de leur héros sur leur propre appareil sans avoir accès aux contrôles du Maître du Jeu. Une URL partageable `/game/view/:sessionId` affiche toutes les cartes héros en lecture seule avec rafraîchissement automatique toutes les 5 secondes.

---

## 2. Architecture

### Composants

```
components/
├── hero-card/                   ← NOUVEAU composant partagé
│   ├── hero-card.ts
│   ├── hero-card.html
│   └── hero-card.css
│
├── game-board/                  ← MODIFIÉ — logique GM uniquement
│   ├── game-board.ts            (grille de HeroCard, readonly=false)
│   ├── game-board.html
│   └── game-board.css           (styles page uniquement)
│
└── player-view/                 ← NOUVEAU composant page
    ├── player-view.ts
    ├── player-view.html
    └── player-view.css
```

### Routes

```
/game/board/:sessionId   →  GameBoard   (Maître du Jeu)
/game/view/:sessionId    →  PlayerView  (Joueurs — lecture seule)
```

---

## 3. Composant `HeroCard`

Composant standalone autonome, sans logique métier propre — reçoit tout via inputs, remonte les actions via outputs.

### Inputs

| Input | Type | Description |
|---|---|---|
| `hero` | `HeroDTO` | Données persistées du héros (nom, classe, stats de base, or) |
| `liveState` | `LiveStat` | État live : hp, sp, pendingGoldEntries, pendingEquipements |
| `readonly` | `boolean` | `true` → masque tous les contrôles d'édition |
| `quest` | `QuestBookEntry \| null` | Pour afficher la récompense d'or attendue |

### Outputs (ignorés si `readonly=true`)

| Output | Payload | Description |
|---|---|---|
| `hpChange` | `number` (+1 ou -1) | Clic sur ± PV |
| `spChange` | `number` (+1 ou -1) | Clic sur ± PE |
| `goldEntryAdd` | `GoldEntryDTO` | Ajout d'une entrée d'or |
| `goldEntryRemove` | `number` (index) | Suppression d'une entrée d'or |
| `equipementAdd` | `string` (Equipment id) | Ajout d'un équipement trouvé |
| `equipementRemove` | `number` (index) | Suppression d'un équipement |

### Contenu affiché (readonly=true et readonly=false)

- Badge classe + nom + label "Hors combat" si hp=0
- Barre HP avec valeur + max + barre de progression rouge
- Barre SP avec valeur + max + barre de progression bleue
- Stats ATK / DEF
- Or total + liste des entrées en attente (montant + commentaire)
- Équipements en attente (liste de chips)
- Coin décoratifs or (CSS ::before / ::after)

### Contenu affiché uniquement si `readonly=false`

- Boutons ± sur HP et SP
- Formulaire d'ajout d'entrée d'or (montant + note + bouton)
- Bouton × sur chaque entrée d'or
- Sélecteur d'équipement + bouton d'ajout
- Bouton × sur chaque équipement en attente

---

## 4. Refactoring `GameBoard`

`GameBoard` garde toute sa logique actuelle (`liveStats`, `autoSave`, `endQuest`, `abandon`, polling avec protection `lastLocalChange`). La seule modification est le template : la boucle `@for (hero of heroes())` est remplacée par `<app-hero-card>` qui reçoit les données et émet les events.

`game-board.css` ne garde que les styles de page (`.page-container`, `.page-header`, `.board`, `.board-1/2/3/4`, `.save-ok`, `.save-error`). Les styles de carte migrent dans `hero-card.css`.

---

## 5. Composant `PlayerView`

### Chargement

- `ngOnInit` : lit `sessionId` depuis `ActivatedRoute`, appelle `gameSessionService.load(sessionId)` + charge les héros participants via `heroService.getAll()` filtré sur `session.heroIds`
- Si session introuvable ou status ≠ `IN_PROGRESS` → redirect `/game`
- `liveStats` initialisé depuis `session.heroStates` (même logique que `GameBoard.initLiveStats`)

### Polling

- Toutes les 5 secondes : `gameSessionService.refresh(sessionId)` → met à jour `liveStats` depuis le serveur
- Pas de protection `lastLocalChange` (aucune modification locale possible)
- Indicateur visuel : icône `sync` dans le header, tourne (`@keyframes spin`) pendant le poll

### Header

- Badge session (`displayName`)
- Badge quête si présente
- Icône de sync
- Bouton "Copier le lien" → `navigator.clipboard.writeText(window.location.href)` avec feedback visuel (icône `check` pendant 2s)

### Grille

Identique à `GameBoard` : classes `.board`, `.board-1/2/3/4`. Utilise `<app-hero-card [readonly]="true">`.

---

## 6. Lien de partage dans `GameSetup`

Après `create()`, une fois la session créée et avant la navigation, afficher dans `GameSetup` (ou en toast) le lien `/game/view/:sessionId` avec un bouton "Copier le lien joueur". Cela permet au MJ de distribuer l'URL aux joueurs avant de naviguer vers son propre tableau de bord.

Implémentation : dans `GameSessionService.create()`, après la création de session, émettre l'id via un signal `lastCreatedSessionId` que `GameSetup` observe pour afficher le lien avant la navigation automatique. La navigation est retardée de 0ms (via `setTimeout`) pour laisser le template se mettre à jour.

---

## 7. Ce qui ne change pas

- Le backend est inchangé — `PlayerView` utilise les mêmes endpoints que `GameBoard`
- `GameSessionService` est inchangé — `PlayerView` l'utilise directement
- Les styles globaux (`styles.css`, `material-theme.scss`) sont inchangés
- `GameSetup` et `HeroList` sont inchangés sauf l'ajout du lien de partage dans `GameSetup`
