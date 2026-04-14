import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HeroDTO, HeroCreateRequest, HeroUpdateRequest } from '../models/hero.model';

@Injectable({ providedIn: 'root' })
export class HeroService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8029/HQHeroes/api/v1/heroes';

  getAll(): Observable<HeroDTO[]> {
    return this.http.get<HeroDTO[]>(this.apiUrl);
  }

  getById(id: string): Observable<HeroDTO> {
    return this.http.get<HeroDTO>(`${this.apiUrl}/${id}`);
  }

  create(hero: HeroCreateRequest): Observable<HeroDTO> {
    return this.http.post<HeroDTO>(this.apiUrl, hero);
  }

  update(id: string, hero: HeroUpdateRequest): Observable<HeroDTO> {
    return this.http.put<HeroDTO>(`${this.apiUrl}/${id}`, hero);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
