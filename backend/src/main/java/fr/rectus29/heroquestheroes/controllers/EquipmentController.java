package fr.rectus29.heroquestheroes.controllers;

import fr.rectus29.heroquestheroes.dto.EquipmentDTO;
import fr.rectus29.heroquestheroes.enums.Equipment;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/v1/equipments")
public class EquipmentController {

    @GetMapping
    public List<EquipmentDTO> getAll(
            @RequestParam(required = false) Equipment.Category category,
            @RequestParam(required = false) Equipment.Source   source) {

        return Arrays.stream(Equipment.values())
                .filter(e -> category == null || e.getCategory() == category)
                .filter(e -> source   == null || e.getSource()   == source)
                .map(EquipmentDTO::from)
                .toList();
    }
}