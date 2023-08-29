package fr.rectus29.heroquestheroes.repository;

import fr.rectus29.heroquestheroes.enums.HeroClass;
import fr.rectus29.heroquestheroes.model.Hero;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;

public interface HeroRepository  extends MongoRepository<Hero, ObjectId> {

    @Query("{name:'?0'}")
    Optional<Hero> findByName(String name);

    @Query("{heroClass:'?0'}")
    List<Hero> findAllByHeroClass(HeroClass heroClass);

}
