package fr.rectus29.heroquestheroes.controllers;

import fr.rectus29.heroquestheroes.dto.HeroDTO;
import fr.rectus29.heroquestheroes.dto.HeroUpdateRequest;
import fr.rectus29.heroquestheroes.model.GoldEntry;
import fr.rectus29.heroquestheroes.model.Hero;
import fr.rectus29.heroquestheroes.services.HeroService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
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

    @PutMapping("/{id}")
    public HeroDTO updateHero(@PathVariable("id") final ObjectId id, @RequestBody HeroUpdateRequest request) {
        Hero hero = heroService.findOneById(id).orElseThrow();
        hero.setName(request.getName())
                .setHealthPoints(request.getHealthPoints())
                .setSpiritPoints(request.getSpiritPoints())
                .setAttackPoints(request.getAttackPoints())
                .setDefencePoints(request.getDefencePoints())
                .setGoldEntries(request.getGoldEntries())
                .setComment(request.getComment())
                .setCompletedQuests(request.getCompletedQuests());
        return HeroDTO.from(heroService.save(hero));
    }

    @DeleteMapping("/{id}")
    public void deleteHero(@PathVariable("id") final ObjectId id) {
        heroService.deleteById(id);
    }

}
