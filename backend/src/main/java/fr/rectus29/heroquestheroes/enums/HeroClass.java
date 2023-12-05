package fr.rectus29.heroquestheroes.enums;

public enum HeroClass {
    BARBARE(8, 2, 3, 2),
    ELFE(6, 4, 2, 2),
    NAIN(6, 4, 2, 2),
    ENCHANTEUR(4, 6, 1, 2);

    private int spiritPoints;
    private int healthPoints;
    private int attackPoints;
    private int defencePoints;

    private HeroClass(int healthPoint, int spiritPoint, int attackDice, int defenceDice) {
        this.spiritPoints = spiritPoint;
        this.healthPoints = healthPoint;
        this.attackPoints = attackDice;
        this.defencePoints = defenceDice;
    }

    public int getSpiritPoints() {
        return spiritPoints;
    }

    public int getHealthPoints() {
        return healthPoints;
    }
}
