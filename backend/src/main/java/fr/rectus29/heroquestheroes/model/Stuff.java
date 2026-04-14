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

    @Data
    public static class StuffAttribute {
        private StuffAttributeDogma dogma;
        private int value = 0;
    }

    public enum StuffAttributeDogma {
        HEALTH, SPIRIT, ATTACK, DEFENCE
    }
}
