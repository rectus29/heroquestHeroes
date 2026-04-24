import { HeroClass } from './hero-class.enum';

export interface EquipmentCatalogDTO {
  id: string;
  label: string;
  description: string;
  category: 'ARME' | 'ARMURE' | 'POTION' | 'SORT' | 'AMULETTE';
  source: 'ARMURERIE' | 'RECOMPENSE_QUETE';
  goldCost: number;
  attackMod: number;
  defenceMod: number;
  healthMod: number;
  spiritMod: number;
}

export interface HeroSessionStateDTO {
  heroId: string;
  currentHp: number;
  currentSp: number;
  pendingGoldEntries: GoldEntryDTO[];
  pendingEquipements: string[];
}

export interface GameSessionDTO {
  id: string;
  name: string | null;
  displayName: string;
  questId: string | null;
  heroIds: string[];
  heroStates: HeroSessionStateDTO[];
  status: 'IN_PROGRESS' | 'ENDED' | 'ABANDONED';
  creationInstant: string;
  updateInstant: string | null;
}

export interface StuffAttributeDTO {
  dogme: 'HEALTH' | 'SPIRIT' | 'ATTACK' | 'DEFENCE';
  value: number;
}

export interface StuffRequest {
  equipment: string;
  attributesList: { dogma: 'HEALTH' | 'SPIRIT' | 'ATTACK' | 'DEFENCE'; value: number }[];
}

export interface StuffDTO {
  id: string;
  name: string;
  desc: string;
  attributes: StuffAttributeDTO[];
}

export interface GoldEntryDTO {
  amount: number;
  comment: string | null;
  date: string | null;
}

export interface HeroDTO {
  id: string;
  name: string;
  heroClass: HeroClass;
  spiritPoints: number;
  healthPoints: number;
  attackPoints: number;
  defencePoints: number;
  resolvedAttackPoints: number;
  resolvedDefencePoints: number;
  goldAmount: number;
  goldEntries: GoldEntryDTO[];
  comment: string | null;
  completedQuests: string[];
  equipements: StuffDTO[];
}

export interface HeroCreateRequest {
  name: string;
  heroClass: HeroClass;
  healthPoints: number;
  spiritPoints: number;
  attackPoints: number;
  defencePoints: number;
  comment?: string | null;
  goldEntries: never[];
  equipements: never[];
}

export interface HeroUpdateRequest {
  name: string;
  heroClass: HeroClass;
  healthPoints: number;
  spiritPoints: number;
  attackPoints: number;
  defencePoints: number;
  goldEntries: GoldEntryDTO[];
  comment: string | null;
  completedQuests: string[];
  equipements: StuffRequest[];
}