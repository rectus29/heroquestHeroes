package fr.rectus29.heroquestheroes.model;


import fr.rectus29.heroquestheroes.enums.HeroClass;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@EqualsAndHashCode(callSuper = true)
@Accessors(chain = true)
@Document("hero")
public class Hero extends GenericEntity {

    private String name;
    private HeroClass heroClass;
    @Transient
    private int spiritPoints = 0;
    @Transient
    private int healthPoints = 0;
    @Transient
    private int attackPoints = 0;
    @Transient
    private int defencePoints = 0;
    private List<GoldEntry> goldEntries = new ArrayList<>();
    private List<Stuff> equipements = new ArrayList<>();

}