package fr.rectus29.heroquestheroes.dto;

import fr.rectus29.heroquestheroes.model.GameSession;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class UpdateSessionStateRequest {
    private List<GameSession.HeroSessionState> heroStates = new ArrayList<>();
}
