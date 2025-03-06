import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, of, forkJoin } from 'rxjs';
import { map, catchError, concatMap, toArray, retry, delay } from 'rxjs/operators';

export interface Superhero {
  id: string;
  name: string;
  response?: string;
  powerstats: {
    intelligence: string;
    strength: string;
    speed: string;
    durability: string;
    power: string;
    combat: string;
  };
  biography: {
    'full-name': string;
    'alter-egos': string;
    aliases: string[];
    'place-of-birth': string;
    'first-appearance': string;
    publisher: string;
    alignment: string;
  };
  appearance: {
    gender: string;
    race: string;
    height: string[];
    weight: string[];
    'eye-color': string;
    'hair-color': string;
  };
  work: {
    occupation: string;
    base: string;
  };
  connections: {
    'group-affiliation': string;
    relatives: string;
  };
  image: {
    url: string;
  };
}

export interface SearchResult {
  response: string;
  'results-for': string;
  results: Superhero[];
}

@Injectable({
  providedIn: 'root'
})
export class SuperheroService {
  // Using Angular's proxy configuration
  // NOTE: This approach works for development only.
  // For production, you would need to implement a proper backend proxy server
  // that makes the API requests on behalf of your frontend application.
  private apiUrl = '/api';
  
  // Cache for heroes to improve performance
  private heroesCache: Map<string, Superhero> = new Map();
  
  constructor(private http: HttpClient) { }

  // Get a superhero by ID
  getSuperheroById(id: string): Observable<Superhero> {
    // Check cache first
    if (this.heroesCache.has(id)) {
      return of(this.heroesCache.get(id)!);
    }
    
    return this.http.get<Superhero>(`${this.apiUrl}/${id}`).pipe(
      retry(1), // Retry failed request once
      map(hero => {
        // Store in cache
        this.heroesCache.set(id, hero);
        return hero;
      }),
      catchError(error => {
        console.error(`Error fetching hero with ID ${id}:`, error);
        return of({} as Superhero);
      })
    );
  }

  // Search superheroes by name
  searchSuperheroByName(name: string): Observable<Superhero[]> {
    return this.http.get<SearchResult>(`${this.apiUrl}/search/${name}`).pipe(
      retry(1), // Retry failed request once
      map(response => {
        if (response.response === 'success') {
          // Update cache with search results
          response.results.forEach(hero => {
            this.heroesCache.set(hero.id, hero);
          });
          return response.results;
        }
        return [];
      }),
      catchError(error => {
        console.error(`Error searching for hero "${name}":`, error);
        return of([]);
      })
    );
  }

  // Get initial heroes for the first page
  getAllSuperheroes(): Observable<Superhero[]> {
    // Fetch just 9 heroes for the first page
    const initialHeroes = 9;
    const heroIds = Array.from({ length: initialHeroes }, (_, i) => (i + 1).toString());
    
    // Check if all heroes are already in cache
    const cachedHeroes = heroIds
      .filter(id => this.heroesCache.has(id))
      .map(id => this.heroesCache.get(id)!);
    
    if (cachedHeroes.length === initialHeroes) {
      // All heroes are in cache, return immediately
      return of(cachedHeroes);
    }
    
    // For heroes not in cache, fetch them in parallel with a small delay
    // This is more efficient than sequential requests while still respecting rate limits
    const requests = heroIds.map((id, index) => {
      // Check cache first
      if (this.heroesCache.has(id)) {
        return of(this.heroesCache.get(id)!);
      }
      
      // Add a small staggered delay to avoid overwhelming the API
      // but much faster than sequential requests
      return this.http.get<Superhero>(`${this.apiUrl}/${id}`).pipe(
        delay(index * 50), // Smaller staggered delay (50ms between requests)
        map(hero => {
          this.heroesCache.set(id, hero);
          return hero;
        }),
        catchError(() => of(null))
      );
    });
    
    // Process all requests in parallel
    return forkJoin(requests).pipe(
      map(heroes => heroes.filter(hero => hero && hero.id && hero.name) as Superhero[]),
      catchError(error => {
        console.error('Error fetching heroes:', error);
        return of([]);
      })
    );
  }
} 