export enum HeroClass {
  BARBARE = 'BARBARE',
  ELFE = 'ELFE',
  NAIN = 'NAIN',
  ENCHANTEUR = 'ENCHANTEUR',
}

export interface HeroClassInfo {
  label: string;
  icon: string;
  color: string;
  healthPoints: number;
  spiritPoints: number;
  attackPoints: number;
  defencePoints: number;
}

export const HERO_CLASS_INFO: Record<HeroClass, HeroClassInfo> = {
  [HeroClass.BARBARE]: {
    label: 'Barbare',
    icon: 'sports_kabaddi',
    color: '#c62828',
    healthPoints: 8,
    spiritPoints: 2,
    attackPoints: 3,
    defencePoints: 2,
  },
  [HeroClass.ELFE]: {
    label: 'Elfe',
    icon: 'forest',
    color: '#2e7d32',
    healthPoints: 6,
    spiritPoints: 4,
    attackPoints: 2,
    defencePoints: 2,
  },
  [HeroClass.NAIN]: {
    label: 'Nain',
    icon: 'hardware',
    color: '#e65100',
    healthPoints: 6,
    spiritPoints: 4,
    attackPoints: 2,
    defencePoints: 2,
  },
  [HeroClass.ENCHANTEUR]: {
    label: 'Enchanteur',
    icon: 'auto_fix_high',
    color: '#6a1b9a',
    healthPoints: 4,
    spiritPoints: 6,
    attackPoints: 1,
    defencePoints: 2,
  },
};

export const ALL_HERO_CLASSES = Object.values(HeroClass);