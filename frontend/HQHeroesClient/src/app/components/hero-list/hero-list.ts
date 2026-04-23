import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { forkJoin } from 'rxjs';
import { HeroService } from '../../services/hero.service';
import { GameSessionService } from '../../services/game-session.service';
import { HeroDTO } from '../../models/hero.model';
import { HERO_CLASS_INFO, HeroClass } from '../../models/hero-class.enum';

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

  heroes         = signal<HeroDTO[]>([]);
  loading        = signal(true);
  error          = signal<string | null>(null);
  activeSessionCount = signal(0);

  ngOnInit(): void {
    forkJoin({
      heroes:   this.heroService.getAll(),
      sessions: this.gameSessionService.listActive(),
    }).subscribe({
      next: ({ heroes, sessions }) => {
        this.heroes.set(heroes);
        this.activeSessionCount.set(sessions.length);
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
}
