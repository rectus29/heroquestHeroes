package fr.rectus29.heroquestheroes.model;

import lombok.Data;
import lombok.experimental.Accessors;

import java.util.ArrayList;
import java.util.List;

@Data
@Accessors(chain = true)
public class Stuff {

    private String name;
    private String desc;

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
