package fr.rectus29.heroquestheroes.controllers;

import fr.rectus29.heroquestheroes.dto.CreateSessionRequest;
import fr.rectus29.heroquestheroes.dto.GameSessionDTO;
import fr.rectus29.heroquestheroes.dto.UpdateSessionStateRequest;
import fr.rectus29.heroquestheroes.model.GameSession;
import fr.rectus29.heroquestheroes.services.GameSessionService;
import org.bson.types.ObjectId;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/v1/sessions")
public class GameSessionController {

    private final GameSessionService sessionService;

    public GameSessionController(GameSessionService sessionService) {
        this.sessionService = sessionService;
    }

    @PostMapping
    public GameSessionDTO create(@RequestBody CreateSessionRequest request) {
        return GameSessionDTO.from(sessionService.create(request));
    }

    @GetMapping
    public List<GameSessionDTO> getAll(@RequestParam(required = false) GameSession.Status status) {
        return sessionService.findAll(status).stream().map(GameSessionDTO::from).toList();
    }

    @GetMapping("/{id}")
    public GameSessionDTO getById(@PathVariable ObjectId id) {
        return GameSessionDTO.from(sessionService.findById(id).orElseThrow());
    }

    @PutMapping("/{id}/state")
    public GameSessionDTO updateState(@PathVariable ObjectId id, @RequestBody UpdateSessionStateRequest request) {
        return GameSessionDTO.from(sessionService.updateState(id, request.getHeroStates()));
    }

    @PostMapping("/{id}/end")
    public void end(@PathVariable ObjectId id) {
        sessionService.end(id);
    }

    @PostMapping("/{id}/abandon")
    public void abandon(@PathVariable ObjectId id) {
        sessionService.abandon(id);
    }
}
