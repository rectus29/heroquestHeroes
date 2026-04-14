package fr.rectus29.heroquestheroes.dto;

import fr.rectus29.heroquestheroes.enums.Quest;

public class QuestDTO {

    private String id;
    private int    number;
    private String title;
    private int    goldRewardPerHero;
    private String rewardNotes;

    public static QuestDTO from(Quest quest) {
        QuestDTO dto = new QuestDTO();
        dto.id                = quest.name();
        dto.number            = quest.getNumber();
        dto.title             = quest.getTitle();
        dto.goldRewardPerHero = quest.getGoldRewardPerHero();
        dto.rewardNotes       = quest.getRewardNotes();
        return dto;
    }

    public String getId()               { return id; }
    public int    getNumber()           { return number; }
    public String getTitle()            { return title; }
    public int    getGoldRewardPerHero(){ return goldRewardPerHero; }
    public String getRewardNotes()      { return rewardNotes; }
}