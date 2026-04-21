import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HeroService } from '../../services/hero.service';
import { QuestBookService } from '../../services/quest-book.service';
import { GameSessionService } from '../../services/game-session.service';
import { HeroDTO } from '../../models/hero.model';
import { HERO_CLASS_INFO, HeroClass } from '../../models/hero-class.enum';
import { QuestBookEntry } from '../../models/base-quest-book';

@Component({
  selector: 'app-game-setup',
  imports: [
    RouterLink,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTooltipModule,
  ],
  templateUrl: './game-setup.html',
  styleUrl: './game-setup.css',
})
export class GameSetup implements OnInit {
  private readonly heroService        = inject(HeroService);
  private readonly questBookService   = inject(QuestBookService);
  private readonly gameSessionService = inject(GameSessionService);
  private readonly router             = inject(Router);

  allHeroes  = signal<HeroDTO[]>([]);
  allQuests  = signal<QuestBookEntry[]>([]);
  loading    = signal(true);

  selectedHeroes  = signal<HeroDTO[]>([]);
  selectedQuestId = '';

  ngOnInit(): void {
    this.heroService.getAll().subscribe({
      next: (heroes) => {
        this.allHeroes.set(heroes);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
    this.questBookService.getAll().subscribe({
      next: (quests) => this.allQuests.set(quests),
    });
  }

  getClassInfo(heroClass: HeroClass) {
    return HERO_CLASS_INFO[heroClass];
  }

  isSelected(heroId: string): boolean {
    return this.selectedHeroes().some(h => h.id === heroId);
  }

  toggleHero(hero: HeroDTO): void {
    if (this.isSelected(hero.id)) {
      this.selectedHeroes.update(list => list.filter(h => h.id !== hero.id));
    } else if (this.selectedHeroes().length < 4) {
      this.selectedHeroes.update(list => [...list, hero]);
    }
  }

  start(): void {
    const quest = this.allQuests().find(q => q.id === this.selectedQuestId) ?? null;
    this.gameSessionService.set(this.selectedHeroes(), quest);
    this.router.navigate(['/game/board']);
  }
}