package fr.rectus29.heroquestheroes.utils;

import fr.rectus29.heroquestheroes.model.Hero;
import fr.rectus29.heroquestheroes.model.Stuff;

public class HeroUtils {


    public static int resolveAttackPoint(final Hero hero) {
        return resolve(hero, Stuff.StuffAttributeDogma.ATTACK);
    }

    public static int resolveDefencePoint(final Hero hero) {
        return resolve(hero, Stuff.StuffAttributeDogma.DEFENCE);
    }


    private static int resolve(Hero h, Stuff.StuffAttributeDogma dogma) {
        var baseValue = (dogma.equals(Stuff.StuffAttributeDogma.ATTACK)) ? h.getAttackPoints() : h.getDefencePoints();
        var modifier = h.getEquipements().stream()
                .flatMap(e -> e.getAttributesList().stream())
                .filter(att -> att.getDogma().equals(dogma))
                .map(Stuff.StuffAttribute::getValue)
                .reduce(0,  Integer::sum);
        return baseValue + modifier;
    }
}
