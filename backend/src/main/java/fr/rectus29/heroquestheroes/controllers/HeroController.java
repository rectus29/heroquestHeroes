package fr.rectus29.heroquestheroes.controllers;

import fr.rectus29.heroquestheroes.dto.HeroDTO;
import fr.rectus29.heroquestheroes.model.Hero;
import fr.rectus29.heroquestheroes.repository.HeroRepository;
import fr.rectus29.heroquestheroes.services.HeroService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Objects;

@RestController
@CrossOrigin(origins = "http://localhost:4200/")
@RequestMapping("api/v1/heroes")
public class HeroController {

    private final HeroService heroService;

    @Autowired
    public HeroController(HeroService heroService) {
        this.heroService = heroService;
    }

    @GetMapping
    public List<HeroDTO> getAllHeroes() {
        return heroService.findAll().stream().map(HeroDTO::from).toList();
    }


    @GetMapping("/{id}")
    public HeroDTO getHero(@PathVariable(value = "id", required = true)final ObjectId id) {
        return HeroDTO.from(heroService.findOneById(id).orElseThrow());
    }

    @PostMapping
    public Hero createHero(@RequestBody Hero hero) {
        return heroService.save(hero);
    }

}
