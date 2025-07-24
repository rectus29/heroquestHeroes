package fr.rectus29.heroquestheroes.services;

import fr.rectus29.heroquestheroes.model.Hero;
import fr.rectus29.heroquestheroes.repository.HeroRepository;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class HeroService {
    private HeroRepository heroRepository;

    public HeroService(HeroRepository heroRepository) {
        this.heroRepository = heroRepository;
    }

    public List<Hero> findAll() {
        return this.heroRepository.findAll();
    }

    public Optional<Hero> findOneById(ObjectId id){
        return this.heroRepository.findById(id);
    }

    public Hero save(Hero hero) {
        return this.heroRepository.save(hero);
    }


}
