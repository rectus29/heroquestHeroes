package fr.rectus29.heroquestheroes.services;

import fr.rectus29.heroquestheroes.model.Hero;
import fr.rectus29.heroquestheroes.repository.HeroRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

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

    public Hero save(Hero hero) {
        return this.heroRepository.save(hero);
    }
}
