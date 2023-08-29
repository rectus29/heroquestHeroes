package fr.rectus29.heroquestheroes.model;


import fr.rectus29.heroquestheroes.enums.HeroClass;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@EqualsAndHashCode(callSuper = true)
@Accessors(chain = true)
@Document("hero")
public class Hero extends GenericEntity{

    private String name;
    private HeroClass heroClass;
    private int spiritPoints = 0;
    private int HealthPoints = 0;

}
