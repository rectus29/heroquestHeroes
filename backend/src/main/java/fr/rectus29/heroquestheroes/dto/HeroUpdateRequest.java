package fr.rectus29.heroquestheroes.dto;

import fr.rectus29.heroquestheroes.enums.Quest;
import fr.rectus29.heroquestheroes.model.GoldEntry;
import fr.rectus29.heroquestheroes.model.Stuff;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class HeroUpdateRequest {
    private String name;
    private int healthPoints;
    private int spiritPoints;
    private int attackPoints;
    private int defencePoints;
    private List<GoldEntry> goldEntries = new ArrayList<>();
    private String comment;
    private List<Quest> completedQuests = new ArrayList<>();
    private List<Stuff> equipements = new ArrayList<>();
}