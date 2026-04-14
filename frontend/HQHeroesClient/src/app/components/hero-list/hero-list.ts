import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HeroService } from '../../services/hero.service';
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
  private readonly heroService = inject(HeroService);

  heroes = signal<HeroDTO[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.heroService.getAll().subscribe({
      next: (heroes) => {
        this.heroes.set(heroes);
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