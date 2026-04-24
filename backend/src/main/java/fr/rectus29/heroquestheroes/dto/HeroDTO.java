package fr.rectus29.heroquestheroes.dto;

import fr.rectus29.heroquestheroes.enums.Quest;
import fr.rectus29.heroquestheroes.enums.HeroClass;
import fr.rectus29.heroquestheroes.model.GoldEntry;
import fr.rectus29.heroquestheroes.model.Hero;
import fr.rectus29.heroquestheroes.model.Stuff;
import fr.rectus29.heroquestheroes.utils.HeroUtils;
import lombok.Data;
import lombok.experimental.Accessors;
import org.bson.types.ObjectId;

import java.util.ArrayList;
import java.util.List;

@Data
@Accessors(chain = true)
public class HeroDTO {

    private ObjectId id;
    private String name;
    private HeroClass heroClass;
    private int spiritPoints = 0;
    private int healthPoints = 0;
    private int attackPoints = 0;
    private int defencePoints = 0;
    private int goldAmount = 0;
    private List<GoldEntryDTO> goldEntries = new ArrayList<>();

    private int resolvedAttackPoints = 0;
    private int resolvedDefencePoints = 0;

    private String comment;
    private List<Quest> completedQuests = new ArrayList<>();

    private List<StuffDTO> equipements = new ArrayList<>();

    public static HeroDTO from(Hero hero) {
        return new HeroDTO()
                .setId(hero.getId())
                .setName(hero.getName())
                .setHeroClass(hero.getHeroClass())
                .setSpiritPoints(hero.getHeroClass().getSpiritPoints())
                .setHealthPoints(hero.getHealthPoints())
                .setAttackPoints(hero.getAttackPoints())
                .setDefencePoints(hero.getDefencePoints())
                .setGoldAmount(hero.getGoldEntries().stream().map(GoldEntry::getAmount).reduce(0, Integer::sum))
                .setGoldEntries(hero.getGoldEntries().stream().map(GoldEntryDTO::from).toList())
                .setEquipements(hero.getEquipements().stream().map(StuffDTO::from).toList())
                .setComment(hero.getComment())
                .setCompletedQuests(new ArrayList<>(hero.getCompletedQuests()))
                .setResolvedAttackPoints(HeroUtils.resolveAttackPoint(hero))
                .setResolvedDefencePoints(HeroUtils.resolveDefencePoint(hero));
    }

    @Data
    @Accessors(chain = true)
    public static class GoldEntryDTO {
        private int    amount;
        private String comment;
        private java.util.Date date;

        public static GoldEntryDTO from(GoldEntry entry) {
            return new GoldEntryDTO()
                    .setAmount(entry.getAmount())
                    .setComment(entry.getComment())
                    .setDate(entry.getDate());
        }
    }

    @Data
    @Accessors(chain = true)
    public static class StuffDTO {
        private String id;
        private String name;
        private String desc;
        private List<StuffAttributeDTO> attributes = new ArrayList<>();

        @Data
        public static class StuffAttributeDTO {
            private String dogme;
            private int value;
        }

        public static StuffDTO from(Stuff stuff) {
            return new StuffDTO()
                    .setId(stuff.getEquipment().name())
                    .setName(stuff.getEquipment().getLabel())
                    .setDesc(stuff.getEquipment().getDescription())
                    .setAttributes(stuff.getAttributesList().stream().map(attrib -> new StuffAttributeDTO().setDogme(attrib.getDogma().name()).setValue(attrib.getValue())).toList());
        }
    }
}
