package fr.rectus29.heroquestheroes.model;

import lombok.Data;
import lombok.experimental.Accessors;

import java.util.Date;

@Data
@Accessors(chain = true)
public class GoldEntry {
    private Date date = new Date();
    private int amount = 0;

    public GoldEntry() {
    }

    public GoldEntry(int amount) {
        this.amount = amount;
    }
}