# HeroQuest Heroes

Application web de gestion des héros pour les parties de **HeroQuest** (édition originale MB, 1990).
Gardez une trace de vos aventuriers entre les quêtes : statistiques, équipement, or accumulé et progression dans le livre de quêtes.

---

## Fonctionnalités

- **Créer** un héros en choisissant sa classe (Barbare, Elfe, Nain, Enchanteur)
- **Consulter** sa fiche : points de vie, points d'esprit, attaque, défense, or, équipement et quêtes accomplies
- **Modifier** ses statistiques, ses notes et les quêtes terminées via un formulaire d'édition
- **Supprimer** un héros en fin de campagne
- Calcul automatique des points d'attaque et de défense **résolus** en tenant compte des bonus d'équipement

---

## Stack technique

| Couche | Technologie |
|---|---|
| Backend | Spring Boot 3.4.3 — Java 21 — Maven |
| Base de données | MongoDB |
| Migrations BDD | Mongock 5.4.4 |
| Frontend | Angular 21 (standalone components, Signals) |
| UI | Angular Material 21 — thème sombre personnalisé |
| API | REST JSON — port 8029 |

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
│           ├── controllers/  HeroController, QuestController
│           ├── dto/          HeroDTO, HeroUpdateRequest, QuestDTO
│           ├── enums/        HeroClass, Quest, Equipment, MonsterType
│           ├── model/        Hero, Stuff, GoldEntry
│           ├── services/     HeroService
│           └── migration/    Mongock — index unique sur le nom du héros
└── frontend/HQHeroesClient/  Client Angular
    └── src/app/
        ├── components/       hero-list, hero-create, hero-detail
        ├── models/           interfaces TypeScript
        └── services/         HeroService, QuestBookService
```

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