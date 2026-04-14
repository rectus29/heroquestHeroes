package fr.rectus29.heroquestheroes.dto;

import fr.rectus29.heroquestheroes.enums.Equipment;

public class EquipmentDTO {

    private String id;
    private String label;
    private String description;
    private String category;
    private String source;
    private int    goldCost;
    private int    attackMod;
    private int    defenceMod;
    private int    healthMod;
    private int    spiritMod;

    public static EquipmentDTO from(Equipment e) {
        EquipmentDTO dto = new EquipmentDTO();
        dto.id          = e.name();
        dto.label       = e.getLabel();
        dto.description = e.getDescription();
        dto.category    = e.getCategory().name();
        dto.source      = e.getSource().name();
        dto.goldCost    = e.getGoldCost();
        dto.attackMod   = e.getAttackMod();
        dto.defenceMod  = e.getDefenceMod();
        dto.healthMod   = e.getHealthMod();
        dto.spiritMod   = e.getSpiritMod();
        return dto;
    }

    public String getId()          { return id;          }
    public String getLabel()       { return label;       }
    public String getDescription() { return description; }
    public String getCategory()    { return category;    }
    public String getSource()      { return source;      }
    public int    getGoldCost()    { return goldCost;    }
    public int    getAttackMod()   { return attackMod;   }
    public int    getDefenceMod()  { return defenceMod;  }
    public int    getHealthMod()   { return healthMod;   }
    public int    getSpiritMod()   { return spiritMod;   }
}