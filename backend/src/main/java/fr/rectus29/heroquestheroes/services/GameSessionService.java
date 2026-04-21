package fr.rectus29.heroquestheroes.services;

import fr.rectus29.heroquestheroes.dto.CreateSessionRequest;
import fr.rectus29.heroquestheroes.enums.Equipment;
import fr.rectus29.heroquestheroes.enums.Quest;
import fr.rectus29.heroquestheroes.model.GameSession;
import fr.rectus29.heroquestheroes.model.GoldEntry;
import fr.rectus29.heroquestheroes.model.Hero;
import fr.rectus29.heroquestheroes.model.Stuff;
import fr.rectus29.heroquestheroes.repository.GameSessionRepository;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class GameSessionService {

    private final GameSessionRepository sessionRepository;
    private final HeroService heroService;

    public GameSessionService(GameSessionRepository sessionRepository, HeroService heroService) {
        this.sessionRepository = sessionRepository;
        this.heroService = heroService;
    }

    public GameSession create(CreateSessionRequest request) {
        List<GameSession.HeroSessionState> heroStates = request.getHeroIds().stream()
                .map(heroId -> {
                    Hero hero = heroService.findOneById(new ObjectId(heroId)).orElseThrow();
                    return new GameSession.HeroSessionState()
                            .setHeroId(heroId)
                            .setCurrentHp(hero.getHealthPoints())
                            .setCurrentSp(hero.getSpiritPoints());
                })
                .toList();

        GameSession session = new GameSession()
                .setName(request.getName())
                .setQuestId(request.getQuestId())
                .setHeroIds(new ArrayList<>(request.getHeroIds()))
                .setHeroStates(new ArrayList<>(heroStates))
                .setStatus(GameSession.Status.IN_PROGRESS);

        return sessionRepository.save(session);
    }

    public List<GameSession> findAll(GameSession.Status status) {
        if (status != null) {
            return sessionRepository.findByStatus(status);
        }
        return sessionRepository.findAll();
    }

    public Optional<GameSession> findById(ObjectId id) {
        return sessionRepository.findById(id);
    }

    public GameSession updateState(ObjectId id, List<GameSession.HeroSessionState> heroStates) {
        GameSession session = sessionRepository.findById(id).orElseThrow();
        session.setHeroStates(heroStates);
        return sessionRepository.save(session);
    }

    public void end(ObjectId id) {
        GameSession session = sessionRepository.findById(id).orElseThrow();

        Quest quest = null;
        if (session.getQuestId() != null) {
            try {
                quest = Quest.valueOf(session.getQuestId());
            } catch (IllegalArgumentException ignored) {
            }
        }

        for (GameSession.HeroSessionState state : session.getHeroStates()) {
            Hero hero = heroService.findOneById(new ObjectId(state.getHeroId())).orElseThrow();

            List<GoldEntry> goldEntries = new ArrayList<>(hero.getGoldEntries());
            goldEntries.addAll(state.getPendingGoldEntries());
            if (quest != null && quest.getGoldRewardPerHero() > 0) {
                goldEntries.add(new GoldEntry(quest.getGoldRewardPerHero(), "Récompense — " + quest.getTitle()));
            }

            List<Stuff> equipements = new ArrayList<>(hero.getEquipements());
            for (Equipment e : state.getPendingEquipements()) {
                equipements.add(Stuff.from(e));
            }

            List<Quest> completedQuests = new ArrayList<>(hero.getCompletedQuests());
            if (quest != null && !completedQuests.contains(quest)) {
                completedQuests.add(quest);
            }

            hero.setGoldEntries(goldEntries)
                    .setEquipements(equipements)
                    .setCompletedQuests(completedQuests);
            heroService.save(hero);
        }

        session.setStatus(GameSession.Status.ENDED);
        sessionRepository.save(session);
    }

    public void abandon(ObjectId id) {
        GameSession session = sessionRepository.findById(id).orElseThrow();
        session.setStatus(GameSession.Status.ABANDONED);
        sessionRepository.save(session);
    }
}
