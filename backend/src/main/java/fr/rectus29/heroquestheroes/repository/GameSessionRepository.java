package fr.rectus29.heroquestheroes.repository;

import fr.rectus29.heroquestheroes.model.GameSession;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface GameSessionRepository extends MongoRepository<GameSession, ObjectId> {
    List<GameSession> findByStatus(GameSession.Status status);
}
