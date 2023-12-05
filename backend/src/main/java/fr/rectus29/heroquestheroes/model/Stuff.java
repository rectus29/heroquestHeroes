package fr.rectus29.heroquestheroes.model;

import lombok.Data;
import lombok.experimental.Accessors;

import java.util.ArrayList;
import java.util.List;

@Data
@Accessors(chain = true)
public class Stuff implements HeroModifier {

    private String name;
    private String desc;

    private List<StuffAttribute> attributesList = new ArrayList<>();

    @Override
    public Hero apply(Hero hero) {
        attributesList.forEach(attribute -> {
            if (StuffAttributeDogma.SPIRIT.equals(attribute.getDogma())) {
                hero.setSpiritPoints(hero.getSpiritPoints() + attribute.getValue());
            } else if (StuffAttributeDogma.HEALTH.equals(attribute.getDogma())) {
                hero.setHealthPoints(hero.getHealthPoints() + attribute.getValue());
            } else if (StuffAttributeDogma.ATTACK.equals(attribute.getDogma())) {
                hero.setAttackPoints(hero.getAttackPoints() + attribute.getValue());
            } else if (StuffAttributeDogma.DEFENCE.equals(attribute.getDogma())) {
                hero.setDefencePoints(hero.getDefencePoints() + attribute.getValue());
            }
        });
        return hero;
    }

    @Data
    public static class StuffAttribute {
        private StuffAttributeDogma dogma;
        private int value = 0;
    }

    public enum StuffAttributeDogma {
        HEALTH, SPIRIT, ATTACK, DEFENCE
    }
}
