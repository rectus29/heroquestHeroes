package fr.rectus29.heroquestheroes.model;

import lombok.Data;
import lombok.experimental.Accessors;

@Data
@Accessors(chain = true)
public class Stuff {

    private String name;
    private String desc;


}
