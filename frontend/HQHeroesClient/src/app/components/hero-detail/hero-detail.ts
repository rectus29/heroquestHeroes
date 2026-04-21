import { Component, inject, signal, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HeroService } from '../../services/hero.service';
import { QuestBookService } from '../../services/quest-book.service';
import { GoldEntryDTO, HeroDTO, HeroUpdateRequest } from '../../models/hero.model';
import { HERO_CLASS_INFO, HeroClass } from '../../models/hero-class.enum';
import { QuestBookEntry } from '../../models/base-quest-book';

@Component({
  selector: 'app-hero-detail',
  imports: [
    DatePipe,
    RouterLink,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './hero-detail.html',
  styleUrl: './hero-detail.css',
})
export class HeroDetail implements OnInit {
  private readonly heroService = inject(HeroService);
  private readonly questBookService = inject(QuestBookService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  hero = signal<HeroDTO | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  editMode = signal(false);
  saving = signal(false);

  allQuests = signal<QuestBookEntry[]>([]);

  // Champs du formulaire d'édition
  editName = '';
  editHealthPoints = 0;
  editSpiritPoints = 0;
  editAttackPoints = 0;
  editDefencePoints = 0;
  editGoldEntries: GoldEntryDTO[] = [];
  editComment = '';
  editCompletedQuests: string[] = [];

  // Formulaire d'ajout d'une entrée d'or
  newEntryAmount = 0;
  newEntryComment = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;

    this.questBookService.getAll().subscribe({
      next: (quests) => this.allQuests.set(quests),
    });

    this.heroService.getById(id).subscribe({
      next: (hero) => {
        this.hero.set(hero);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Héros introuvable ou serveur indisponible.');
        this.loading.set(false);
      },
    });
  }

  getClassInfo(heroClass: HeroClass) {
    return HERO_CLASS_INFO[heroClass];
  }

  getDogmeLabel(dogme: string): string {
    const labels: Record<string, string> = {
      HEALTH: 'PV', SPIRIT: 'PE', ATTACK: 'ATK', DEFENCE: 'DEF',
    };
    return labels[dogme] ?? dogme;
  }

  getDogmeIcon(dogme: string): string {
    const icons: Record<string, string> = {
      HEALTH: 'favorite', SPIRIT: 'auto_awesome', ATTACK: 'gavel', DEFENCE: 'security',
    };
    return icons[dogme] ?? 'star';
  }

  getDogmeClass(dogme: string): string {
    const classes: Record<string, string> = {
      HEALTH: 'health', SPIRIT: 'spirit', ATTACK: 'attack', DEFENCE: 'defence',
    };
    return classes[dogme] ?? '';
  }

  // ── Édition gold journal ────────────────────────────────────────────────

  editGoldTotal(): number {
    return this.editGoldEntries.reduce((sum, e) => sum + e.amount, 0);
  }

  addGoldEntry(): void {
    if (this.newEntryAmount === 0) return;
    this.editGoldEntries = [
      ...this.editGoldEntries,
      { amount: this.newEntryAmount, comment: this.newEntryComment || null, date: new Date().toISOString() },
    ];
    this.newEntryAmount = 0;
    this.newEntryComment = '';
  }

  removeGoldEntry(index: number): void {
    this.editGoldEntries = this.editGoldEntries.filter((_, i) => i !== index);
  }

  // ── Mode édition ─────────────────────────────────────────────────────────

  startEdit(): void {
    const hero = this.hero()!;
    this.editName = hero.name;
    this.editHealthPoints = hero.healthPoints;
    this.editSpiritPoints = hero.spiritPoints;
    this.editAttackPoints = hero.attackPoints;
    this.editDefencePoints = hero.defencePoints;
    this.editGoldEntries = [...(hero.goldEntries ?? [])];
    this.editComment = hero.comment ?? '';
    this.editCompletedQuests = [...(hero.completedQuests ?? [])];
    this.newEntryAmount = 0;
    this.newEntryComment = '';
    this.editMode.set(true);
  }

  cancelEdit(): void {
    this.editMode.set(false);
  }

  save(): void {
    const hero = this.hero()!;
    this.saving.set(true);
    const request: HeroUpdateRequest = {
      name: this.editName,
      heroClass: hero.heroClass,
      healthPoints: this.editHealthPoints,
      spiritPoints: this.editSpiritPoints,
      attackPoints: this.editAttackPoints,
      defencePoints: this.editDefencePoints,
      goldEntries: this.editGoldEntries,
      comment: this.editComment || null,
      completedQuests: this.editCompletedQuests,
      equipements: hero.equipements,
    };
    this.heroService.update(hero.id, request).subscribe({
      next: (updated) => {
        this.hero.set(updated);
        this.editMode.set(false);
        this.saving.set(false);
      },
      error: () => {
        this.saving.set(false);
      },
    });
  }

  isQuestCompleted(questId: string): boolean {
    return this.editCompletedQuests.includes(questId);
  }

  toggleQuest(questId: string): void {
    const idx = this.editCompletedQuests.indexOf(questId);
    if (idx === -1) {
      this.editCompletedQuests.push(questId);
    } else {
      this.editCompletedQuests.splice(idx, 1);
    }
  }

  delete(): void {
    if (!confirm(`Supprimer définitivement ${this.hero()!.name} ?`)) return;
    this.heroService.delete(this.hero()!.id).subscribe({
      next: () => this.router.navigate(['/heroes']),
    });
  }
}