import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HeroService } from '../../services/hero.service';
import { GameSessionService } from '../../services/game-session.service';
import { GameSessionDTO, HeroDTO } from '../../models/hero.model';
import { HeroCard, LiveStat } from '../hero-card/hero-card';

@Component({
  selector: 'app-player-view',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    HeroCard,
  ],
  templateUrl: './player-view.html',
  styleUrl: './player-view.css',
})
export class PlayerView implements OnInit, OnDestroy {
  private readonly gameSessionService = inject(GameSessionService);
  private readonly heroService        = inject(HeroService);
  private readonly route              = inject(ActivatedRoute);
  private readonly router             = inject(Router);

  session   = signal<GameSessionDTO | null>(null);
  heroes    = signal<HeroDTO[]>([]);
  quest     = this.gameSessionService.quest;
  liveStats = signal<LiveStat[]>([]);
  syncing   = signal(false);
  copied    = signal(false);

  private pollIntervalId: ReturnType<typeof setInterval> | null = null;

  get sessionId(): string {
    return this.route.snapshot.paramMap.get('sessionId')!;
  }

  ngOnInit(): void {
    const sessionId = this.sessionId;
    if (!sessionId) { this.router.navigate(['/game']); return; }

    this.gameSessionService.refresh(sessionId).subscribe({
      next: (session) => {
        if (session.status !== 'IN_PROGRESS') {
          this.router.navigate(['/game']); return;
        }
        this.session.set(session);
        this.heroService.getAll().subscribe(allHeroes => {
          const sessionHeroes = allHeroes.filter(h => session.heroIds.includes(h.id));
          this.heroes.set(sessionHeroes);
          this.initLiveStats(sessionHeroes, session);
        });
      },
      error: () => this.router.navigate(['/game']),
    });

    this.startPolling();
  }

  ngOnDestroy(): void {
    if (this.pollIntervalId !== null) clearInterval(this.pollIntervalId);
  }

  private startPolling(): void {
    this.pollIntervalId = setInterval(() => {
      this.syncing.set(true);
      this.gameSessionService.refresh(this.sessionId).subscribe({
        next: (session) => {
          this.session.set(session);
          this.applyServerState(session);
          this.syncing.set(false);
        },
        error: () => this.syncing.set(false),
      });
    }, 5000);
  }

  private initLiveStats(heroes: HeroDTO[], session: GameSessionDTO): void {
    this.liveStats.set(
      heroes.map(hero => {
        const state = session.heroStates.find(s => s.heroId === hero.id);
        return {
          hp: state?.currentHp ?? hero.healthPoints,
          sp: state?.currentSp ?? hero.spiritPoints,
          pendingGoldEntries: state?.pendingGoldEntries ?? [],
          pendingEquipements: state?.pendingEquipements ?? [],
        };
      })
    );
  }

  private applyServerState(session: GameSessionDTO): void {
    this.liveStats.update(stats =>
      stats.map((stat, i) => {
        const hero = this.heroes()[i];
        if (!hero) return stat;
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

  copyLink(): void {
    navigator.clipboard.writeText(window.location.href);
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2000);
  }
}
