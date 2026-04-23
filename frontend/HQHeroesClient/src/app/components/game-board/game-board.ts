import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HeroService } from '../../services/hero.service';
import { GameSessionService } from '../../services/game-session.service';
import { GameSessionDTO, GoldEntryDTO, HeroDTO, HeroSessionStateDTO } from '../../models/hero.model';
import { HERO_CLASS_INFO } from '../../models/hero-class.enum';
import { HeroCard, LiveStat } from '../hero-card/hero-card';

@Component({
  selector: 'app-game-board',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    HeroCard,
  ],
  templateUrl: './game-board.html',
  styleUrl: './game-board.css',
})
export class GameBoard implements OnInit, OnDestroy {
  private readonly heroService        = inject(HeroService);
  private readonly gameSessionService = inject(GameSessionService);
  private readonly route              = inject(ActivatedRoute);
  private readonly router             = inject(Router);

  heroes    = this.gameSessionService.heroes;
  quest     = this.gameSessionService.quest;
  session   = this.gameSessionService.session;
  saveError = this.gameSessionService.saveError;
  saving    = signal(false);

  liveStats = signal<LiveStat[]>([]);

  private pollIntervalId: ReturnType<typeof setInterval> | null = null;
  private lastLocalChange = 0;

  get sessionId(): string {
    return this.route.snapshot.paramMap.get('sessionId')!;
  }

  ngOnInit(): void {
    const sessionId = this.sessionId;
    if (!sessionId) { this.router.navigate(['/game']); return; }

    if (!this.session()) {
      this.gameSessionService.load(sessionId);
    }

    if (this.heroes().length === 0) {
      this.heroService.getAll().subscribe(heroes => {
        const session = this.session();
        if (session) {
          const sessionHeroes = heroes.filter(h => session.heroIds.includes(h.id));
          this.gameSessionService.setHeroes(sessionHeroes, this.quest());
          this.initLiveStats(sessionHeroes);
        }
      });
    } else {
      this.initLiveStats(this.heroes());
    }

    this.startPolling();
  }

  ngOnDestroy(): void {
    if (this.pollIntervalId !== null) clearInterval(this.pollIntervalId);
  }

  private startPolling(): void {
    this.pollIntervalId = setInterval(() => {
      if (Date.now() - this.lastLocalChange < 2000) return;
      this.gameSessionService.refresh(this.sessionId).subscribe({
        next: (session) => {
          this.session.set(session);
          this.applyServerState(session);
        },
      });
    }, 5000);
  }

  private applyServerState(session: GameSessionDTO): void {
    if (!session) return;
    this.liveStats.update(stats =>
      stats.map((stat, i) => {
        const hero = this.heroes()[i];
        const serverState = session.heroStates.find(s => s.heroId === hero.id);
        if (!serverState) return stat;
        return {
          hp:                 serverState.currentHp,
          sp:                 serverState.currentSp,
          pendingGoldEntries: serverState.pendingGoldEntries,
          pendingEquipements: serverState.pendingEquipements,
        };
      })
    );
  }

  private initLiveStats(heroes: HeroDTO[]): void {
    const session = this.session();
    this.liveStats.set(
      heroes.map(hero => {
        const state = session?.heroStates.find(s => s.heroId === hero.id);
        return {
          hp: state?.currentHp ?? hero.healthPoints,
          sp: state?.currentSp ?? hero.spiritPoints,
          pendingGoldEntries: state?.pendingGoldEntries ?? [],
          pendingEquipements: state?.pendingEquipements ?? [],
        };
      })
    );
  }

  maxHp(hero: HeroDTO): number { return HERO_CLASS_INFO[hero.heroClass].healthPoints; }
  maxSp(hero: HeroDTO): number { return HERO_CLASS_INFO[hero.heroClass].spiritPoints; }

  changeHp(index: number, delta: number): void {
    this.liveStats.update(stats => {
      const copy = [...stats];
      copy[index] = { ...copy[index], hp: Math.max(0, Math.min(this.maxHp(this.heroes()[index]), copy[index].hp + delta)) };
      return copy;
    });
    this.autoSave();
  }

  changeSp(index: number, delta: number): void {
    this.liveStats.update(stats => {
      const copy = [...stats];
      copy[index] = { ...copy[index], sp: Math.max(0, Math.min(this.maxSp(this.heroes()[index]), copy[index].sp + delta)) };
      return copy;
    });
    this.autoSave();
  }

  addGoldEntry(heroIndex: number, entry: GoldEntryDTO): void {
    this.liveStats.update(stats => {
      const copy = [...stats];
      copy[heroIndex] = {
        ...copy[heroIndex],
        pendingGoldEntries: [...copy[heroIndex].pendingGoldEntries, entry],
      };
      return copy;
    });
    this.autoSave();
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
    this.autoSave();
  }

  addEquipement(heroIndex: number, equipId: string): void {
    this.liveStats.update(stats => {
      const copy = [...stats];
      copy[heroIndex] = {
        ...copy[heroIndex],
        pendingEquipements: [...copy[heroIndex].pendingEquipements, equipId],
      };
      return copy;
    });
    this.autoSave();
  }

  removeEquipement(heroIndex: number, equipIndex: number): void {
    this.liveStats.update(stats => {
      const copy = [...stats];
      copy[heroIndex] = {
        ...copy[heroIndex],
        pendingEquipements: copy[heroIndex].pendingEquipements.filter((_, i) => i !== equipIndex),
      };
      return copy;
    });
    this.autoSave();
  }

  private markLocalChange(): void { this.lastLocalChange = Date.now(); }

  private autoSave(): void {
    this.markLocalChange();
    const sessionId = this.sessionId;
    if (!sessionId) return;
    const heroStates: HeroSessionStateDTO[] = this.heroes().map((hero, i) => ({
      heroId: hero.id,
      currentHp: this.liveStats()[i].hp,
      currentSp: this.liveStats()[i].sp,
      pendingGoldEntries: this.liveStats()[i].pendingGoldEntries,
      pendingEquipements: this.liveStats()[i].pendingEquipements,
    }));
    this.gameSessionService.triggerAutoSave(sessionId, heroStates);
  }

  endQuest(): void {
    this.saving.set(true);
    this.gameSessionService.end(this.sessionId).subscribe({
      next: () => { this.gameSessionService.clear(); this.router.navigate(['/heroes']); },
      error: () => this.saving.set(false),
    });
  }

  abandon(): void {
    this.gameSessionService.abandon(this.sessionId).subscribe({
      next: () => { this.gameSessionService.clear(); this.router.navigate(['/heroes']); },
      error: () => {},
    });
  }
}
