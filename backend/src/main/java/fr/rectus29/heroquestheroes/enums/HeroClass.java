package fr.rectus29.heroquestheroes.enums;

public enum HeroClass {
    BARBARE(4, 2), ELFE(2,2), NAIN(3,1), ENCHANTEUR(4,1);

    private int spiritPoints;
    private int healthPoints;

    private HeroClass(int spiritPoint, int healthPoint) {
        this.spiritPoints = spiritPoint;
        this.healthPoints = healthPoint;
    }

    public int getSpiritPoints() {
        return spiritPoints;
    }

    public int getHealthPoints() {
        return healthPoints;
    }
}
