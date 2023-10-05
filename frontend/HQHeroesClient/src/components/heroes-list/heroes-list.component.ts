import {Component, OnInit} from '@angular/core';
import { HeroService } from '../../services/hero.service';
import {Hero} from "../../model/hero";

@Component({
  selector: 'app-heroes-list',
  templateUrl: './heroes-list.component.html',
  styleUrls: ['./heroes-list.component.css']
})
export class HeroesListComponent implements OnInit {

 heroes: Hero[] = []

  constructor(private heroService: HeroService) {
  }

  ngOnInit() {
    this.heroService.findAll().subscribe(data => {
      this.heroes = data;
    });
  }
}
