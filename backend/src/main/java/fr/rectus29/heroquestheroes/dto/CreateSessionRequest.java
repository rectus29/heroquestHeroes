package fr.rectus29.heroquestheroes.dto;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class CreateSessionRequest {
    private List<String> heroIds = new ArrayList<>();
    private String questId;
    private String name;
}
