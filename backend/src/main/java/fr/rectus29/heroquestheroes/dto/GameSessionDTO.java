package fr.rectus29.heroquestheroes.dto;

import fr.rectus29.heroquestheroes.enums.Quest;
import fr.rectus29.heroquestheroes.model.GameSession;
import fr.rectus29.heroquestheroes.model.GoldEntry;
import lombok.Data;
import lombok.experimental.Accessors;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Data
@Accessors(chain = true)
public class GameSessionDTO {

    private String id;
    private String name;
    private String displayName;
    private String questId;
    private List<String> heroIds = new ArrayList<>();
    private List<HeroSessionStateDTO> heroStates = new ArrayList<>();
    private GameSession.Status status;
    private Instant creationInstant;
    private Instant updateInstant;

    @Data
    @Accessors(chain = true)
    public static class HeroSessionStateDTO {
        private String heroId;
        private int currentHp;
        private int currentSp;
        private List<GoldEntry> pendingGoldEntries = new ArrayList<>();
        private List<String> pendingEquipements = new ArrayList<>();
    }

    public static GameSessionDTO from(GameSession session) {
        String displayName = session.getName();
        if (displayName == null || displayName.isBlank()) {
            String dateStr = DateTimeFormatter.ofPattern("dd/MM/yyyy")
                    .withZone(ZoneId.systemDefault())
                    .format(session.getCreationInstant());
            if (session.getQuestId() != null) {
                try {
                    Quest quest = Quest.valueOf(session.getQuestId());
                    displayName = quest.getNumber() + " — " + dateStr;
                } catch (IllegalArgumentException e) {
                    displayName = session.getQuestId() + " — " + dateStr;
                }
            } else {
                displayName = "Partie libre — " + dateStr;
            }
        }

        List<HeroSessionStateDTO> stateDTOs = session.getHeroStates().stream()
                .map(s -> new HeroSessionStateDTO()
                        .setHeroId(s.getHeroId())
                        .setCurrentHp(s.getCurrentHp())
                        .setCurrentSp(s.getCurrentSp())
                        .setPendingGoldEntries(new ArrayList<>(s.getPendingGoldEntries()))
                        .setPendingEquipements(s.getPendingEquipements().stream()
                                .map(Enum::name)
                                .toList()))
                .toList();

        return new GameSessionDTO()
                .setId(session.getId().toString())
                .setName(session.getName())
                .setDisplayName(displayName)
                .setQuestId(session.getQuestId())
                .setHeroIds(new ArrayList<>(session.getHeroIds()))
                .setHeroStates(stateDTOs)
                .setStatus(session.getStatus())
                .setCreationInstant(session.getCreationInstant())
                .setUpdateInstant(session.getUpdateInstant());
    }
}
