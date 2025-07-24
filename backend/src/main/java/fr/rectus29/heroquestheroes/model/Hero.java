package fr.rectus29.heroquestheroes.model;


import fr.rectus29.heroquestheroes.enums.HeroClass;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@EqualsAndHashCode(callSuper = true)
@Accessors(chain = true)
@Document(Hero.HEROES)
public class Hero extends GenericEntity {

    public static final String HEROES = "heroes";

    @Indexed(unique = true)
    private String name;
    private HeroClass heroClass;
    private int spiritPoints = 0;
    private int healthPoints = 0;
    private int attackPoints = 0;
    private int defencePoints = 0;
    private List<GoldEntry> goldEntries = new ArrayList<>();
    private List<Stuff> equipements = new ArrayList<>();

}