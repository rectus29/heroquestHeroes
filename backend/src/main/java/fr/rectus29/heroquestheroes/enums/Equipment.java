package fr.rectus29.heroquestheroes.enums;

/**
 * Catalogue du matériel disponible dans HeroQuest (édition originale MB, 1990).
 *
 * <p>Comprend les articles de l'armurerie achetables entre les quêtes
 * et les récompenses uniques obtenues en terminant certaines quêtes.</p>
 *
 * <p>Les modificateurs de stats (attack, defence, health, spirit) représentent
 * le bonus permanent apporté par l'objet lorsqu'il est équipé / utilisé.</p>
 */
public enum Equipment {

    // ── Armurerie — Armes ──────────────────────────────────────────────────

    EPEE_COURTE(
            "Épée courte",
            "Arme légère à une main. Convient à tous les héros.",
            Category.ARME, Source.ARMURERIE, 75,
            2, 0, 0, 0),

    EPEE_LONGUE(
            "Épée longue",
            "Arme puissante à une main. Réservée au Barbare et au Nain.",
            Category.ARME, Source.ARMURERIE, 150,
            3, 0, 0, 0),

    ARBALETE(
            "Arbalète",
            "Arme de tir à deux mains. Peut attaquer à distance.",
            Category.ARME, Source.ARMURERIE, 150,
            3, 0, 0, 0),

    HACHE_DE_BATAILLE(
            "Hache de bataille",
            "Arme lourde à deux mains. Interdit le port d'un bouclier.",
            Category.ARME, Source.ARMURERIE, 175,
            3, 0, 0, 0),

    // ── Armurerie — Armures & protections ─────────────────────────────────

    BOUCLIER(
            "Bouclier",
            "Protection légère. Incompatible avec les armes à deux mains.",
            Category.ARMURE, Source.ARMURERIE, 50,
            0, 1, 0, 0),

    CASQUE(
            "Casque",
            "Protège la tête. Compatible avec toutes les armures.",
            Category.ARMURE, Source.ARMURERIE, 125,
            0, 1, 0, 0),

    COTTE_DE_MAILLES(
            "Cotte de mailles",
            "Armure intermédiaire. Portée par le Barbare et le Nain.",
            Category.ARMURE, Source.ARMURERIE, 150,
            0, 2, 0, 0),

    ARMURE_DE_PLATES(
            "Armure de plates",
            "Armure complète. Très lourde : interdit de courir.",
            Category.ARMURE, Source.ARMURERIE, 350,
            0, 3, 0, 0),

    // ── Armurerie — Potions & consommables ────────────────────────────────

    POTION_DE_GUERISON(
            "Potion de guérison",
            "Restaure 4 points de corps. Usage unique.",
            Category.POTION, Source.ARMURERIE, 150,
            0, 0, 4, 0),

    EAU_BENITE(
            "Eau bénite",
            "Restaure 2 points d'esprit. Usage unique.",
            Category.POTION, Source.ARMURERIE, 75,
            0, 0, 0, 2),

    POTION_DE_FORCE(
            "Potion de force",
            "Ajoute 2 dés d'attaque pour ce tour. Usage unique.",
            Category.POTION, Source.ARMURERIE, 150,
            2, 0, 0, 0),

    POTION_DE_DEFENSE(
            "Potion de défense",
            "Ajoute 2 dés de défense pour ce tour. Usage unique.",
            Category.POTION, Source.ARMURERIE, 100,
            0, 2, 0, 0),

    // ── Récompenses de quêtes ──────────────────────────────────────────────

    HACHE_NAINE(
            "Hache naine",
            "Récompense Q02 — Les Mines du Nain. Arme à une main forgée par les nains.",
            Category.ARME, Source.RECOMPENSE_QUETE, 0,
            3, 0, 0, 0),

    ARMURE_SIR_RAGNAR(
            "Armure de Sir Ragnar",
            "Récompense Q05 — Le Sauvetage de Sir Ragnar. Armure de chevalier.",
            Category.ARMURE, Source.RECOMPENSE_QUETE, 0,
            0, 2, 0, 0),

    EPEE_RUNIQUE(
            "Épée runique",
            "Récompense Q06 — La Forge des Ors. Seule arme capable de blesser le Seigneur du Mal.",
            Category.ARME, Source.RECOMPENSE_QUETE, 0,
            4, 0, 0, 0),

    SORT_DE_GUERISON(
            "Sort de guérison",
            "Récompense Q07 — Les Catacombes. Sort supplémentaire : restaure 4 points de corps.",
            Category.SORT, Source.RECOMPENSE_QUETE, 0,
            0, 0, 4, 0),

    BOUCLIER_RUNIQUE(
            "Bouclier runique",
            "Récompense Q09 — Le Donjon du Chaos. Bouclier enchanté à 3 dés de défense.",
            Category.ARMURE, Source.RECOMPENSE_QUETE, 0,
            0, 3, 0, 0),

    SORT_BOULE_DE_FEU(
            "Sort de boule de feu",
            "Récompense Q10 — La Tour des Sorciers. Attaque tous les ennemis d'une zone.",
            Category.SORT, Source.RECOMPENSE_QUETE, 0,
            3, 0, 0, 0),

    AMULETTE_DE_RESISTANCE(
            "Amulette de résistance",
            "Récompense Q11 — Le Repaire des Squelettes. Immunise contre tous les sorts ennemis.",
            Category.AMULETTE, Source.RECOMPENSE_QUETE, 0,
            0, 0, 0, 0),

    EPEE_DE_GLACE(
            "Épée de glace",
            "Récompense Q12 — Le Château Maudit. Confère l'immunité au feu.",
            Category.ARME, Source.RECOMPENSE_QUETE, 0,
            4, 0, 0, 0),

    PLAQUE_ARMURE_RUNIQUE(
            "Plaque d'armure runique",
            "Récompense Q13 — Les Portes de l'Abîme. Protection maximale.",
            Category.ARMURE, Source.RECOMPENSE_QUETE, 0,
            0, 4, 0, 0);

    // ── Types ──────────────────────────────────────────────────────────────

    public enum Category { ARME, ARMURE, POTION, SORT, AMULETTE }
    public enum Source   { ARMURERIE, RECOMPENSE_QUETE }

    // ── Champs ─────────────────────────────────────────────────────────────

    private final String   label;
    private final String   description;
    private final Category category;
    private final Source   source;
    private final int      goldCost;
    private final int      attackMod;
    private final int      defenceMod;
    private final int      healthMod;
    private final int      spiritMod;

    // ── Constructeur ────────────────────────────────────────────────────────

    Equipment(String label, String description, Category category, Source source,
              int goldCost, int attackMod, int defenceMod, int healthMod, int spiritMod) {
        this.label       = label;
        this.description = description;
        this.category    = category;
        this.source      = source;
        this.goldCost    = goldCost;
        this.attackMod   = attackMod;
        this.defenceMod  = defenceMod;
        this.healthMod   = healthMod;
        this.spiritMod   = spiritMod;
    }

    // ── Accesseurs ──────────────────────────────────────────────────────────

    public String   getLabel()       { return label;       }
    public String   getDescription() { return description; }
    public Category getCategory()    { return category;    }
    public Source   getSource()      { return source;      }
    public int      getGoldCost()    { return goldCost;    }
    public int      getAttackMod()   { return attackMod;   }
    public int      getDefenceMod()  { return defenceMod;  }
    public int      getHealthMod()   { return healthMod;   }
    public int      getSpiritMod()   { return spiritMod;   }
}