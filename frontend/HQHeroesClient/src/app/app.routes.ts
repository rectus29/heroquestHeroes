import { Routes } from '@angular/router';
import { HeroList } from './components/hero-list/hero-list';
import { HeroCreate } from './components/hero-create/hero-create';
import { HeroDetail } from './components/hero-detail/hero-detail';
import { GameSetup } from './components/game-setup/game-setup';
import { GameBoard } from './components/game-board/game-board';
import { PlayerView } from './components/player-view/player-view';

export const routes: Routes = [
  { path: '', redirectTo: 'heroes', pathMatch: 'full' },
  { path: 'heroes', component: HeroList },
  { path: 'heroes/new', component: HeroCreate },
  { path: 'heroes/:id', component: HeroDetail },
  { path: 'game', component: GameSetup },
  { path: 'game/board/:sessionId', component: GameBoard },
  { path: 'game/view/:sessionId', component: PlayerView },
];