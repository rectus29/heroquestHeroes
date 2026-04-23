package fr.rectus29.heroquestheroes.model;

import fr.rectus29.heroquestheroes.enums.Equipment;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.experimental.Accessors;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

import java.util.ArrayList;
import java.util.List;

@Data
@Accessors(chain = true)
public class Stuff {

    @Id
    private ObjectId id;

    @NotNull
    private Equipment equipment;

    private List<StuffAttribute> attributesList = new ArrayList<>();

    public static Stuff from(Equipment equipment) {
        List<StuffAttribute> attrs = new ArrayList<>();
        if (equipment.getAttackMod() != 0) {
            attrs.add(new StuffAttribute().setDogma(StuffAttributeDogma.ATTACK).setValue(equipment.getAttackMod()));
        }
        if (equipment.getDefenceMod() != 0) {
            attrs.add(new StuffAttribute().setDogma(StuffAttributeDogma.DEFENCE).setValue(equipment.getDefenceMod()));
        }
        if (equipment.getHealthMod() != 0) {
            attrs.add(new StuffAttribute().setDogma(StuffAttributeDogma.HEALTH).setValue(equipment.getHealthMod()));
        }
        if (equipment.getSpiritMod() != 0) {
            attrs.add(new StuffAttribute().setDogma(StuffAttributeDogma.SPIRIT).setValue(equipment.getSpiritMod()));
        }
        return new Stuff().setEquipment(equipment).setAttributesList(attrs);
    }

    @Data
    @Accessors(chain = true)
    public static class StuffAttribute {
        private StuffAttributeDogma dogma;
        private int value = 0;
    }

    public enum StuffAttributeDogma {
        HEALTH, SPIRIT, ATTACK, DEFENCE
    }
}
