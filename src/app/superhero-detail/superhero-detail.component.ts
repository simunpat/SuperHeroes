import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SuperheroService, Superhero } from '../superhero.service';
import { catchError, finalize, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-superhero-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './superhero-detail.component.html',
  styleUrls: ['./superhero-detail.component.css']
})
export class SuperheroDetailComponent implements OnInit {
  hero: Superhero | null = null;
  loading = true;
  error = '';
  powerStats: { name: string; value: number }[] = [];

  constructor(
    private route: ActivatedRoute,
    private superheroService: SuperheroService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadHero(id);
      }
    });
  }

  loadHero(id: string): void {
    this.loading = true;
    this.error = '';
    
    this.superheroService.getSuperheroById(id)
      .pipe(
        tap(hero => {
          if (!hero || !hero.id) {
            this.error = `Could not find hero with ID ${id}`;
          }
        }),
        catchError(err => {
          this.error = 'Failed to load superhero details. Please try again later.';
          console.error('Error loading superhero:', err);
          return of({} as Superhero);
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(hero => {
        this.hero = hero;
        if (hero && hero.id) {
          this.processPowerStats();
        }
      });
  }

  processPowerStats(): void {
    if (!this.hero || !this.hero.powerstats) return;
    
    this.powerStats = [
      { name: 'Intelligence', value: parseInt(this.hero.powerstats.intelligence) || 0 },
      { name: 'Strength', value: parseInt(this.hero.powerstats.strength) || 0 },
      { name: 'Speed', value: parseInt(this.hero.powerstats.speed) || 0 },
      { name: 'Durability', value: parseInt(this.hero.powerstats.durability) || 0 },
      { name: 'Power', value: parseInt(this.hero.powerstats.power) || 0 },
      { name: 'Combat', value: parseInt(this.hero.powerstats.combat) || 0 }
    ];
  }
} 