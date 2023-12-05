import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Hero} from '../model/hero';
import {Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class HeroService {

  private endpointUrl: string;

  constructor(private http: HttpClient) {
    this.endpointUrl = 'http://localhost:8029/api/v1/heroes';
  }

  public findAll(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.endpointUrl);
  }

  public findById(heroId: String): Observable<Hero> {
    return this.http.get<Hero>(this.endpointUrl + "/" + heroId);
  }

  public save(user: Hero) {
    return this.http.post<Hero>(this.endpointUrl, user);
  }
}
