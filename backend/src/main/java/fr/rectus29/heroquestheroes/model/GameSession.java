package fr.rectus29.heroquestheroes.model;

import fr.rectus29.heroquestheroes.enums.Equipment;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Accessors(chain = true)
@Document("game_sessions")
public class GameSession extends GenericEntity {

    private String name;
    private String questId;
    private List<String> heroIds = new ArrayList<>();
    private List<HeroSessionState> heroStates = new ArrayList<>();
    private Status status = Status.IN_PROGRESS;

    public enum Status {
        IN_PROGRESS, ENDED, ABANDONED
    }

    @Getter
    @Setter
    @Accessors(chain = true)
    public static class HeroSessionState {
        private String heroId;
        private int currentHp;
        private int currentSp;
        private List<GoldEntry> pendingGoldEntries = new ArrayList<>();
        private List<Equipment> pendingEquipements = new ArrayList<>();
    }
}
