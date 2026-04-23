import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HeroService } from '../../services/hero.service';
import { QuestBookService } from '../../services/quest-book.service';
import { GameSessionService } from '../../services/game-session.service';
import { HeroDTO, GameSessionDTO } from '../../models/hero.model';
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
    MatInputModule,
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

  allHeroes      = signal<HeroDTO[]>([]);
  allQuests      = signal<QuestBookEntry[]>([]);
  activeSessions = signal<GameSessionDTO[]>([]);
  loading        = signal(true);

  selectedHeroes  = signal<HeroDTO[]>([]);
  selectedQuestId = '';
  sessionName     = '';
  linkCopied      = signal(false);

  get playerLink(): string | null {
    const id = this.gameSessionService.lastCreatedSessionId();
    return id ? `${window.location.origin}/game/view/${id}` : null;
  }

  ngOnInit(): void {
    forkJoin({
      heroes:   this.heroService.getAll(),
      quests:   this.questBookService.getAll(),
      sessions: this.gameSessionService.listActive(),
    }).subscribe({
      next: ({ heroes, quests, sessions }) => {
        this.allHeroes.set(heroes);
        this.allQuests.set(quests);
        this.activeSessions.set(sessions);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
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

  resume(session: GameSessionDTO): void {
    const heroes = this.allHeroes().filter(h => session.heroIds.includes(h.id));
    const quest  = this.allQuests().find(q => q.id === session.questId) ?? null;
    this.gameSessionService.session.set(session);
    this.gameSessionService.setHeroes(heroes, quest);
    this.router.navigate(['/game/board', session.id]);
  }

  start(): void {
    const quest = this.allQuests().find(q => q.id === this.selectedQuestId) ?? null;
    this.gameSessionService.create(this.selectedHeroes(), quest, this.sessionName);
  }

  copyPlayerLink(): void {
    if (!this.playerLink) return;
    navigator.clipboard.writeText(this.playerLink);
    this.linkCopied.set(true);
    setTimeout(() => this.linkCopied.set(false), 2000);
  }

  getSessionHeroNames(session: GameSessionDTO): string {
    return this.allHeroes()
      .filter(h => session.heroIds.includes(h.id))
      .map(h => h.name)
      .join(', ');
  }
}
