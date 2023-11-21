package fr.rectus29.heroquestheroes.model;

import lombok.Data;
import lombok.experimental.Accessors;

import java.util.ArrayList;
import java.util.List;

@Data
@Accessors(chain = true)
public class Stuff implements HeroModifier{

    private String name;
    private String desc;

    private List<StuffAttribute> attributesList = new ArrayList<>();

    @Override
    public Hero apply(Hero hero) {
        attributesList.forEach(attribute -> {
            if("spirit".equals(attribute.getDogme())){
                hero.setSpiritPoints(hero.getSpiritPoints() + attribute.getValue());
            }else if("health".equals(attribute.getDogme())){
                hero.setHealthPoints(hero.getHealthPoints() + attribute.getValue());
            }
        });
        return hero;
    }

    @Data
    public static class StuffAttribute {
        private String dogme;
        private int value = 0;
    }
}
