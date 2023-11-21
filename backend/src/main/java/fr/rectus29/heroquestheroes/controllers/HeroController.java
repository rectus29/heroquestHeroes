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
@RequestMapping("api/v1/heroes")
public class HeroController {

    private HeroService heroService;

    @Autowired
    public HeroController(HeroService heroService) {
        this.heroService = heroService;
    }

    @GetMapping
    public List<HeroDTO> getAllHeroes() {
        return heroService.findAll().stream().map(HeroDTO::from).toList();
    }


    @GetMapping("{id}/resolved")
    public HeroDTO getresolvedHero(@PathVariable("id") String id) {
        return HeroDTO.from(heroService.getResolved(new ObjectId(id)));
    }


    @PostMapping
    public Hero createHero(@RequestBody Hero hero) {
        return heroService.save(hero);
    }

}
