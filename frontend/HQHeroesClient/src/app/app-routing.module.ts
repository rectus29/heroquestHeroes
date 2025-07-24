import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HeroesListComponent} from "../components/heroes-list/heroes-list.component";
import {HeroTileComponent} from "../components/hero-tile/hero-tile.component";
import {PartyBoardComponent} from "../components/party-board/party-board.component";

const routes: Routes = [
  {path: 'heroes', component: HeroesListComponent},
  {path: 'hero/:id', component: HeroTileComponent},
  {path: 'partyboard', component: PartyBoardComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
