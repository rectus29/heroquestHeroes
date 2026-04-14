import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QuestBookEntry } from '../models/base-quest-book';

@Injectable({ providedIn: 'root' })
export class QuestBookService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8029/HQHeroes/api/v1/quest';

  getAll(): Observable<QuestBookEntry[]> {
    return this.http.get<QuestBookEntry[]>(this.apiUrl);
  }
}