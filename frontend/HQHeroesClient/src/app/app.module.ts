import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {HeroesListComponent} from "../../components/heroes-list/heroes-list.component";
import {HeroTileComponent} from "../../components/hero-tile/hero-tile.component";
import {Hero} from "../../model/hero";
import {HeroService} from "../../services/hero.service";

@NgModule({
  declarations: [
    AppComponent,
    HeroesListComponent,
    HeroTileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
