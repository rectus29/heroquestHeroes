import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EquipmentCatalogDTO } from '../models/hero.model';

@Injectable({ providedIn: 'root' })
export class EquipmentService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8029/HQHeroes/api/v1/equipments';

  getAll(): Observable<EquipmentCatalogDTO[]> {
    return this.http.get<EquipmentCatalogDTO[]>(this.apiUrl);
  }
}
