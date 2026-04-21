import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HeroService } from '../../services/hero.service';
import { GameSessionService } from '../../services/game-session.service';
import { GoldEntryDTO, HeroDTO, HeroUpdateRequest } from '../../models/hero.model';
import { HERO_CLASS_INFO, HeroClass } from '../../models/hero-class.enum';

export interface LiveStat {
  hp: number;
  sp: number;
  pendingGoldEntries: GoldEntryDTO[];
}

@Component({
  selector: 'app-game-board',
  imports: [
    RouterLink,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './game-board.html',
  styleUrl: './game-board.css',
})
export class GameBoard implements OnInit {
  private readonly heroService        = inject(HeroService);
  private readonly gameSessionService = inject(GameSessionService);
  private readonly router             = inject(Router);

  heroes  = this.gameSessionService.heroes;
  quest   = this.gameSessionService.quest;
  saving  = signal(false);

  liveStats    = signal<LiveStat[]>([]);
  newGoldInputs: { amount: number; comment: string }[] = [];

  ngOnInit(): void {
    if (this.heroes().length === 0) {
      this.router.navigate(['/game']);
      return;
    }
    this.liveStats.set(
      this.heroes().map(hero => {
        const info = HERO_CLASS_INFO[hero.heroClass];
        return { hp: Math.min(hero.healthPoints, info.healthPoints), sp: hero.spiritPoints, pendingGoldEntries: [] };
      })
    );
    this.newGoldInputs = this.heroes().map(() => ({ amount: 0, comment: '' }));
  }

  getClassInfo(heroClass: HeroClass) { return HERO_CLASS_INFO[heroClass]; }

  maxHp(hero: HeroDTO): number { return HERO_CLASS_INFO[hero.heroClass].healthPoints; }
  maxSp(hero: HeroDTO): number { return HERO_CLASS_INFO[hero.heroClass].spiritPoints; }

  changeHp(index: number, delta: number): void {
    this.liveStats.update(stats => {
      const copy = [...stats];
      copy[index] = { ...copy[index], hp: Math.max(0, Math.min(this.maxHp(this.heroes()[index]), copy[index].hp + delta)) };
      return copy;
    });
  }

  changeSp(index: number, delta: number): void {
    this.liveStats.update(stats => {
      const copy = [...stats];
      copy[index] = { ...copy[index], sp: Math.max(0, Math.min(this.maxSp(this.heroes()[index]), copy[index].sp + delta)) };
      return copy;
    });
  }

  isDead(index: number): boolean {
    return this.liveStats()[index]?.hp === 0;
  }

  // ── Or en cours de partie ───────────────────────────────────────────────

  pendingGoldTotal(index: number): number {
    return this.liveStats()[index].pendingGoldEntries.reduce((s, e) => s + e.amount, 0);
  }

  liveGoldTotal(index: number): number {
    return this.heroes()[index].goldAmount + this.pendingGoldTotal(index);
  }

  addGoldEntry(index: number): void {
    const input = this.newGoldInputs[index];
    if (!input || input.amount === 0) return;
    this.liveStats.update(stats => {
      const copy = [...stats];
      copy[index] = {
        ...copy[index],
        pendingGoldEntries: [
          ...copy[index].pendingGoldEntries,
          { amount: input.amount, comment: input.comment || null, date: new Date().toISOString() },
        ],
      };
      return copy;
    });
    this.newGoldInputs[index] = { amount: 0, comment: '' };
  }

  removePendingEntry(heroIndex: number, entryIndex: number): void {
    this.liveStats.update(stats => {
      const copy = [...stats];
      copy[heroIndex] = {
        ...copy[heroIndex],
        pendingGoldEntries: copy[heroIndex].pendingGoldEntries.filter((_, i) => i !== entryIndex),
      };
      return copy;
    });
  }

  // ── Fin de quête ────────────────────────────────────────────────────────

  endQuest(): void {
    const quest = this.quest();
    this.saving.set(true);

    const saves = this.heroes().map((hero, i) => {
      const completedQuests = quest && !hero.completedQuests.includes(quest.id)
        ? [...hero.completedQuests, quest.id]
        : [...hero.completedQuests];

      const goldEntries: GoldEntryDTO[] = [
        ...hero.goldEntries,
        ...this.liveStats()[i].pendingGoldEntries,
      ];
      if (quest && quest.goldRewardPerHero > 0) {
        goldEntries.push({
          amount: quest.goldRewardPerHero,
          comment: `Récompense — ${quest.title}`,
          date: new Date().toISOString(),
        });
      }

      const request: HeroUpdateRequest = {
        name: hero.name,
        heroClass: hero.heroClass,
        healthPoints: hero.healthPoints,
        spiritPoints: hero.spiritPoints,
        attackPoints: hero.attackPoints,
        defencePoints: hero.defencePoints,
        goldEntries,
        comment: hero.comment,
        completedQuests,
        equipements: hero.equipements,
      };
      return this.heroService.update(hero.id, request);
    });

    forkJoin(saves).subscribe({
      next: () => { this.gameSessionService.clear(); this.router.navigate(['/heroes']); },
      error: () => this.saving.set(false),
    });
  }

  abandon(): void {
    this.gameSessionService.clear();
    this.router.navigate(['/heroes']);
  }
}