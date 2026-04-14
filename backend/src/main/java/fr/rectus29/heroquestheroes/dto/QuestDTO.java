package fr.rectus29.heroquestheroes.dto;

import fr.rectus29.heroquestheroes.enums.Quest;
import lombok.Data;

@Data
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
}