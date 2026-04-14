package fr.rectus29.heroquestheroes.enums;

/**
 * Catalogue des 14 quêtes du livre de base HeroQuest (édition originale MB, 1990).
 *
 * <p>Chaque entrée contient le numéro de quête, le titre, l'objectif résumé,
 * la récompense en or par héros et les éventuelles récompenses spéciales.</p>
 */
public enum
Quest {

    // ── Quêtes d'introduction ──────────────────────────────────────────────

    Q01(1,
            "L'Initiation",
            "Explorez le donjon et éliminez tous les monstres. Apprenez les règles de base du jeu.",
            0,
            null),

    Q02(2,
            "Les Mines du Nain",
            "Trouvez la hache naine cachée dans les mines et rapportez-la à la salle de départ.",
            100,
            "Hache naine (arme à 3 dés d'attaque)"),

    Q03(3,
            "La Salle au Trésor",
            "Récupérez le trésor royal gardé par les orcs et revenez sains et saufs.",
            150,
            null),

    // ── Quêtes principales ─────────────────────────────────────────────────

    Q04(4,
            "Le Passage Secret",
            "Traversez le donjon en empruntant les passages secrets pour rejoindre la sortie.",
            100,
            null),

    Q05(5,
            "Le Sauvetage de Sir Ragnar",
            "Le chevalier Sir Ragnar est emprisonné par les gobelins. Libérez-le et escortez-le jusqu'à la sortie.",
            200,
            "Armure de Sir Ragnar (2 dés de défense)"),

    Q06(6,
            "La Forge des Ors",
            "Trouvez la forge oubliée et récupérez l'épée runique forgée par les anciens nains.",
            200,
            "Épée runique (4 dés d'attaque)"),

    Q07(7,
            "Les Catacombes",
            "Descendez dans les catacombes infestées de squelettes et de zombies. Détruisez l'autel maudit.",
            250,
            "Sort de Guérison supplémentaire"),

    Q08(8,
            "La Citadelle des Ombres",
            "Infiltrez la citadelle occupée par les guerriers du chaos et volez leurs plans de guerre.",
            300,
            null),

    Q09(9,
            "Le Donjon du Chaos",
            "Affrontez la garnison complète du Seigneur du Mal. Seule la porte du fond mène à la liberté.",
            300,
            "Bouclier runique (3 dés de défense)"),

    Q10(10,
            "La Tour des Sorciers",
            "Grimpez dans la tour et trouvez le grimoire volé aux mages blancs avant que le rituel ne soit accompli.",
            350,
            "Sort de Boule de Feu"),

    // ── Quêtes avancées ────────────────────────────────────────────────────

    Q11(11,
            "Le Repaire des Squelettes",
            "Une ancienne crypte a été réanimée par la magie noire. Brisez les cristaux qui alimentent le rituel.",
            350,
            "Amulette de Résistance (immunité aux sorts)"),

    Q12(12,
            "Le Château Maudit",
            "Pénétrez dans le château du lieutenant du Seigneur du Mal et éliminez le chef des guerriers du chaos.",
            400,
            "Épée de glace (4 dés d'attaque, immunité au feu)"),

    Q13(13,
            "Les Portes de l'Abîme",
            "La dernière défense du Seigneur du Mal. Traversez la salle des gargouilless et détruisez le portail dimensionnel.",
            400,
            "Plaque d'armure runique (4 dés de défense)"),

    // ── Quête finale ───────────────────────────────────────────────────────

    Q14(14,
            "Le Seigneur du Mal",
            "Affrontez le Seigneur du Mal dans son sanctuaire ultime. Détruisez-le pour libérer définitivement le royaume. " +
            "Attention : il ne peut être blessé que par l'épée runique.",
            0,
            "Victoire ! Le royaume est sauvé.");

    // ── Champs ─────────────────────────────────────────────────────────────

    private final int    number;
    private final String title;
    private final String briefing;
    private final int    goldRewardPerHero;
    /** Null si pas de récompense spéciale. */
    private final String rewardNotes;

    // ── Constructeur ────────────────────────────────────────────────────────

    Quest(int number, String title, String briefing,
          int goldRewardPerHero, String rewardNotes) {
        this.number            = number;
        this.title             = title;
        this.briefing          = briefing;
        this.goldRewardPerHero = goldRewardPerHero;
        this.rewardNotes       = rewardNotes;
    }

    // ── Accesseurs ──────────────────────────────────────────────────────────

    public int    getNumber()            { return number;            }
    public String getTitle()             { return title;             }
    public String getBriefing()          { return briefing;          }
    public int    getGoldRewardPerHero() { return goldRewardPerHero; }
    public String getRewardNotes()       { return rewardNotes;       }
}