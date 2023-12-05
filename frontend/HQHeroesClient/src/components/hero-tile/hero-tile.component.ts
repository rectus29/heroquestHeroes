import {Component, OnInit} from '@angular/core';
import {Hero} from "../../model/hero";
import {HeroService} from "../../services/hero.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-hero-tile',
  templateUrl: './hero-tile.component.html',
  styleUrls: ['./hero-tile.component.css']
})
export class HeroTileComponent implements OnInit {

  hero: Hero = Hero.emptyObject();

  constructor(
    private heroService: HeroService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    let heroId: String = this.route.snapshot.params['id'];
    this.heroService.findById(heroId).subscribe(h => this.hero = h);
  }
}
