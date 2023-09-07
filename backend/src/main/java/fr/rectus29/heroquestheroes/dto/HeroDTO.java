package fr.rectus29.heroquestheroes.dto;

import fr.rectus29.heroquestheroes.enums.HeroClass;
import fr.rectus29.heroquestheroes.model.GoldEntry;
import fr.rectus29.heroquestheroes.model.Hero;
import fr.rectus29.heroquestheroes.model.Stuff;
import fr.rectus29.heroquestheroes.utils.HeroUtils;
import lombok.Data;
import lombok.experimental.Accessors;

import java.util.ArrayList;
import java.util.List;

@Data
@Accessors(chain = true)
public class HeroDTO {

    private String name;
    private HeroClass heroClass;
    private int spiritPoints = 0;
    private int HealthPoints = 0;
    private int goldAmount = 0;
    private int attackDice = 0;
    private int defenseDice = 0;
    private List<StuffDTO> equipements = new ArrayList<>();

    public static HeroDTO from(Hero hero){
        return new HeroDTO()
                .setName(hero.getName())
                .setHeroClass(hero.getHeroClass())
                .setSpiritPoints(hero.getHeroClass().getSpiritPoints())
                .setHealthPoints(hero.getHealthPoints())
                .setGoldAmount(hero.getGoldEntries().stream().map(GoldEntry::getAmount).reduce(0, Integer::sum))
                .setAttackDice(HeroUtils.computeAttackDice(hero))
                .setDefenseDice(HeroUtils.computeDefenseDice(hero))
                .setEquipements(hero.getEquipements().stream().map(StuffDTO::from).toList());

    }

    @Data
    @Accessors(chain = true)
    public static class StuffDTO{
        private String name;
        private String desc;

        public static StuffDTO from(Stuff stuff){
            return new StuffDTO()
                    .setName(stuff.getName())
                    .setDesc(stuff.getDesc());
        }
    }
}
