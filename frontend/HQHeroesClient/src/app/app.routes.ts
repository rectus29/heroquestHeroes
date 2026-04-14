import { Routes } from '@angular/router';
import { HeroList } from './components/hero-list/hero-list';
import { HeroCreate } from './components/hero-create/hero-create';
import { HeroDetail } from './components/hero-detail/hero-detail';

export const routes: Routes = [
  { path: '', redirectTo: 'heroes', pathMatch: 'full' },
  { path: 'heroes', component: HeroList },
  { path: 'heroes/new', component: HeroCreate },
  { path: 'heroes/:id', component: HeroDetail },
];