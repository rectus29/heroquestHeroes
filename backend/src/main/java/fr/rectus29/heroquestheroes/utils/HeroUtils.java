package fr.rectus29.heroquestheroes.utils;

import fr.rectus29.heroquestheroes.model.Hero;

public class HeroUtils {
    public static int computeAttackDice(Hero hero) {
        return computeDice(hero, "A");
    }

    public static int computeDefenseDice(Hero hero) {
        return computeDice(hero, "D");
    }

    private static int computeDice(Hero hero, String type){
        return 0;
    }
}
