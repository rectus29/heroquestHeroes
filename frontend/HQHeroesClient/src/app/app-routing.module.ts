import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HeroesListComponent} from "../components/heroes-list/heroes-list.component";
import {HeroTileComponent} from "../components/hero-tile/hero-tile.component";

const routes: Routes = [
  {path: 'heroes', component: HeroesListComponent},
  {path: 'hero/:id', component: HeroTileComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
