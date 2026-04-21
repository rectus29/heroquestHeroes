import { HeroClass } from './hero-class.enum';

export interface StuffAttributeDTO {
  dogme: 'HEALTH' | 'SPIRIT' | 'ATTACK' | 'DEFENCE';
  value: number;
}

export interface StuffDTO {
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
  equipements: StuffDTO[];
}