import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HeroService } from '../../services/hero.service';
import { ALL_HERO_CLASSES, HERO_CLASS_INFO, HeroClass } from '../../models/hero-class.enum';

@Component({
  selector: 'app-hero-create',
  imports: [
    RouterLink,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './hero-create.html',
  styleUrl: './hero-create.css',
})
export class HeroCreate {
  private readonly heroService = inject(HeroService);
  private readonly router = inject(Router);

  readonly heroClasses = ALL_HERO_CLASSES;
  readonly classInfo = HERO_CLASS_INFO;

  heroName = '';
  heroComment = '';
  selectedClass = HeroClass.BARBARE;
  submitting = signal(false);
  error = signal<string | null>(null);

  submit(): void {
    const name = this.heroName.trim();
    if (!name) return;
    const info = this.classInfo[this.selectedClass];

    this.submitting.set(true);
    this.error.set(null);

    this.heroService.create({
      name,
      heroClass: this.selectedClass,
      healthPoints: info.healthPoints,
      spiritPoints: info.spiritPoints,
      attackPoints: info.attackPoints,
      defencePoints: info.defencePoints,
      comment: this.heroComment.trim() || null,
      goldEntries: [],
      equipements: [],
    }).subscribe({
      next: (hero) => this.router.navigate(['/heroes', hero.id]),
      error: () => {
        this.error.set('Impossible de créer le héros. Le serveur est-il démarré ?');
        this.submitting.set(false);
      },
    });
  }
}