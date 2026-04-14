package fr.rectus29.heroquestheroes.enums;

/**
 * Types de monstres du livre de quêtes HeroQuest (édition de base).
 * Paramètres : bodyPoints, attackDice, defenceDice
 */
public enum MonsterType {

    GOBELIN(1, 2, 1),
    ORC(1, 3, 2),
    ORC_CHAMPION(2, 3, 2),
    GUERRIER_DU_CHAOS(2, 3, 4),
    SQUELETTE(1, 2, 3),
    ZOMBIE(1, 2, 2),
    MOMIE(3, 3, 4),
    GARGOUILLE(3, 4, 5),
    SEIGNEUR_DU_MAL(5, 4, 6);

    private final int bodyPoints;
    private final int attackDice;
    private final int defenceDice;

    MonsterType(int bodyPoints, int attackDice, int defenceDice) {
        this.bodyPoints   = bodyPoints;
        this.attackDice   = attackDice;
        this.defenceDice  = defenceDice;
    }

    public int getBodyPoints()   { return bodyPoints;  }
    public int getAttackDice()   { return attackDice;  }
    public int getDefenceDice()  { return defenceDice; }
}