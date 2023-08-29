package fr.rectus29.heroquestheroes.controllers;

import fr.rectus29.heroquestheroes.model.Hero;
import fr.rectus29.heroquestheroes.repository.HeroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/v1/heroes")
public class HeroController {

    private HeroRepository heroRepository;

    @Autowired
    public HeroController(HeroRepository heroRepository) {
        this.heroRepository = heroRepository;
    }

    @GetMapping
    public List<Hero> getAllHeroes() {
        return heroRepository.findAll();
    }

    @PostMapping
    public Hero createHero(@RequestBody Hero hero) {
        return heroRepository.save(hero);
    }

}
