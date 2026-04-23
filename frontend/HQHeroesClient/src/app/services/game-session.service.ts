import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject, EMPTY } from 'rxjs';
import { debounceTime, switchMap, catchError, retry } from 'rxjs/operators';
import { GameSessionDTO, HeroSessionStateDTO, HeroDTO } from '../models/hero.model';
import { QuestBookEntry } from '../models/base-quest-book';

@Injectable({ providedIn: 'root' })
export class GameSessionService {
  private readonly http   = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly baseUrl = 'http://localhost:8029/HQHeroes/api/v1/sessions';

  session              = signal<GameSessionDTO | null>(null);
  heroes               = signal<HeroDTO[]>([]);
  quest                = signal<QuestBookEntry | null>(null);
  saveError            = signal(false);
  lastCreatedSessionId = signal<string | null>(null);

  private autoSaveSubject = new Subject<{ sessionId: string; heroStates: HeroSessionStateDTO[] }>();

  constructor() {
    this.autoSaveSubject.pipe(
      debounceTime(800),
      switchMap(({ sessionId, heroStates }) =>
        this.http.put<GameSessionDTO>(`${this.baseUrl}/${sessionId}/state`, { heroStates }).pipe(
          retry(3),
          catchError(() => { this.saveError.set(true); return EMPTY; })
        )
      )
    ).subscribe(() => this.saveError.set(false));
  }

  create(heroes: HeroDTO[], quest: QuestBookEntry | null, name: string): void {
    const body = {
      heroIds: heroes.map(h => h.id),
      questId: quest?.id ?? null,
      name: name.trim() || null,
    };
    this.http.post<GameSessionDTO>(this.baseUrl, body).subscribe({
      next: (session) => {
        this.session.set(session);
        this.heroes.set(heroes);
        this.quest.set(quest);
        this.lastCreatedSessionId.set(session.id);
        setTimeout(() => this.router.navigate(['/game/board', session.id]), 0);
      },
    });
  }

  load(sessionId: string): void {
    this.http.get<GameSessionDTO>(`${this.baseUrl}/${sessionId}`).subscribe({
      next: (session) => this.session.set(session),
      error: () => this.router.navigate(['/game']),
    });
  }

  setHeroes(heroes: HeroDTO[], quest: QuestBookEntry | null): void {
    this.heroes.set(heroes);
    this.quest.set(quest);
  }

  triggerAutoSave(sessionId: string, heroStates: HeroSessionStateDTO[]): void {
    this.autoSaveSubject.next({ sessionId, heroStates });
  }

  refresh(sessionId: string) {
    return this.http.get<GameSessionDTO>(`${this.baseUrl}/${sessionId}`);
  }

  listActive() {
    return this.http.get<GameSessionDTO[]>(`${this.baseUrl}?status=IN_PROGRESS`);
  }

  end(sessionId: string) {
    return this.http.post<void>(`${this.baseUrl}/${sessionId}/end`, {});
  }

  abandon(sessionId: string) {
    return this.http.post<void>(`${this.baseUrl}/${sessionId}/abandon`, {});
  }

  clear(): void {
    this.session.set(null);
    this.heroes.set([]);
    this.quest.set(null);
    this.saveError.set(false);
    this.lastCreatedSessionId.set(null);
  }
}
