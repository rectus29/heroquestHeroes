import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HeroDTO, GoldEntryDTO } from '../../models/hero.model';
import { HERO_CLASS_INFO } from '../../models/hero-class.enum';
import { QuestBookEntry } from '../../models/base-quest-book';

export interface LiveStat {
  hp: number;
  sp: number;
  pendingGoldEntries: GoldEntryDTO[];
  pendingEquipements: string[];
}

const EQUIPMENT_LABELS: Record<string, string> = {
  EPEE_COURTE: 'Épée courte', EPEE_LONGUE: 'Épée longue', ARBALETE: 'Arbalète',
  HACHE_DE_BATAILLE: 'Hache de bataille', BOUCLIER: 'Bouclier', CASQUE: 'Casque',
  COTTE_DE_MAILLES: 'Cotte de mailles', ARMURE_DE_PLATES: 'Armure de plates',
  POTION_DE_GUERISON: 'Potion de guérison', EAU_BENITE: 'Eau bénite',
  POTION_DE_FORCE: 'Potion de force', POTION_DE_DEFENSE: 'Potion de défense',
  HACHE_NAINE: 'Hache naine', ARMURE_SIR_RAGNAR: 'Armure de Sir Ragnar',
  EPEE_RUNIQUE: 'Épée runique', SORT_DE_GUERISON: 'Sort de guérison',
  BOUCLIER_RUNIQUE: 'Bouclier runique', SORT_BOULE_DE_FEU: 'Sort de boule de feu',
  AMULETTE_DE_RESISTANCE: 'Amulette de résistance', EPEE_DE_GLACE: 'Épée de glace',
  ARMURE_DU_CHAOS: 'Armure du Chaos',
};

export const ALL_EQUIPMENT_IDS = Object.keys(EQUIPMENT_LABELS);

@Component({
  selector: 'app-hero-card',
  imports: [
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
  ],
  templateUrl: './hero-card.html',
  styleUrl: './hero-card.css',
})
export class HeroCard {
  hero      = input.required<HeroDTO>();
  liveState = input.required<LiveStat>();
  readonly  = input<boolean>(false);
  quest     = input<QuestBookEntry | null>(null);

  hpChange         = output<number>();
  spChange         = output<number>();
  goldEntryAdd     = output<GoldEntryDTO>();
  goldEntryRemove  = output<number>();
  equipementAdd    = output<string>();
  equipementRemove = output<number>();

  newGoldInput  = { amount: 0, comment: '' };
  newEquipInput = '';

  readonly allEquipmentIds = ALL_EQUIPMENT_IDS;

  getClassInfo()    { return HERO_CLASS_INFO[this.hero().heroClass]; }
  maxHp(): number   { return HERO_CLASS_INFO[this.hero().heroClass].healthPoints; }
  maxSp(): number   { return HERO_CLASS_INFO[this.hero().heroClass].spiritPoints; }
  isDead(): boolean { return this.liveState().hp === 0; }

  hpPercent(): number {
    const max = this.maxHp();
    return max > 0 ? (this.liveState().hp / max) * 100 : 0;
  }

  spPercent(): number {
    const max = this.maxSp();
    return max > 0 ? (this.liveState().sp / max) * 100 : 0;
  }

  pendingGoldTotal(): number {
    return this.liveState().pendingGoldEntries.reduce((s, e) => s + e.amount, 0);
  }

  liveGoldTotal(): number {
    return this.hero().goldAmount + this.pendingGoldTotal();
  }

  getEquipLabel(id: string): string { return EQUIPMENT_LABELS[id] ?? id; }

  onAddGoldEntry(): void {
    if (!this.newGoldInput.amount) return;
    this.goldEntryAdd.emit({
      amount: this.newGoldInput.amount,
      comment: this.newGoldInput.comment || null,
      date: new Date().toISOString(),
    });
    this.newGoldInput = { amount: 0, comment: '' };
  }

  onAddEquipement(): void {
    if (!this.newEquipInput) return;
    this.equipementAdd.emit(this.newEquipInput);
    this.newEquipInput = '';
  }
}
