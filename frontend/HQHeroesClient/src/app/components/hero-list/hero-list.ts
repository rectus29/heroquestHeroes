import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { forkJoin } from 'rxjs';
import { HeroService } from '../../services/hero.service';
import { GameSessionService } from '../../services/game-session.service';
import { QuestBookService } from '../../services/quest-book.service';
import { GameSessionDTO, HeroDTO } from '../../models/hero.model';
import { HERO_CLASS_INFO, HeroClass } from '../../models/hero-class.enum';
import { QuestBookEntry } from '../../models/base-quest-book';

@Component({
  selector: 'app-hero-list',
  imports: [
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './hero-list.html',
  styleUrl: './hero-list.css',
})
export class HeroList implements OnInit {
  private readonly heroService        = inject(HeroService);
  private readonly gameSessionService = inject(GameSessionService);
  private readonly questBookService   = inject(QuestBookService);
  private readonly router             = inject(Router);

  heroes          = signal<HeroDTO[]>([]);
  activeSessions  = signal<GameSessionDTO[]>([]);
  allQuests       = signal<QuestBookEntry[]>([]);
  loading         = signal(true);
  error           = signal<string | null>(null);

  ngOnInit(): void {
    forkJoin({
      heroes:   this.heroService.getAll(),
      sessions: this.gameSessionService.listActive(),
      quests:   this.questBookService.getAll(),
    }).subscribe({
      next: ({ heroes, sessions, quests }) => {
        this.heroes.set(heroes);
        this.activeSessions.set(sessions);
        this.allQuests.set(quests);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Impossible de charger les héros. Le serveur est-il démarré ?');
        this.loading.set(false);
      },
    });
  }

  getClassInfo(heroClass: HeroClass) {
    return HERO_CLASS_INFO[heroClass];
  }

  getSessionHeroNames(session: GameSessionDTO): string {
    return this.heroes()
      .filter(h => session.heroIds.includes(h.id))
      .map(h => h.name)
      .join(', ');
  }

  resume(session: GameSessionDTO): void {
    const heroes = this.heroes().filter(h => session.heroIds.includes(h.id));
    const quest  = this.allQuests().find(q => q.id === session.questId) ?? null;
    this.gameSessionService.session.set(session);
    this.gameSessionService.setHeroes(heroes, quest);
    this.router.navigate(['/game/board', session.id]);
  }
}
