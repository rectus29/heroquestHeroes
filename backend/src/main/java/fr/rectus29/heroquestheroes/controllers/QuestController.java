package fr.rectus29.heroquestheroes.controllers;

import fr.rectus29.heroquestheroes.dto.QuestDTO;
import fr.rectus29.heroquestheroes.enums.Quest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/v1/quest")
public class QuestController {

    @GetMapping
    public List<QuestDTO> getAll() {
        return Arrays.stream(Quest.values())
                .map(QuestDTO::from)
                .toList();
    }
}