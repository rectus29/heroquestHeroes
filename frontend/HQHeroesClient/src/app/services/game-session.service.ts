import { Injectable, signal } from '@angular/core';
import { HeroDTO } from '../models/hero.model';
import { QuestBookEntry } from '../models/base-quest-book';

@Injectable({ providedIn: 'root' })
export class GameSessionService {
  heroes = signal<HeroDTO[]>([]);
  quest  = signal<QuestBookEntry | null>(null);

  set(heroes: HeroDTO[], quest: QuestBookEntry | null): void {
    this.heroes.set(heroes);
    this.quest.set(quest);
  }

  clear(): void {
    this.heroes.set([]);
    this.quest.set(null);
  }
}