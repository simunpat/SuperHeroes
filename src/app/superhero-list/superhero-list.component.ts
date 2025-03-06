import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SuperheroService, Superhero } from '../superhero.service';
import { FormsModule } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-superhero-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './superhero-list.component.html',
  styleUrls: ['./superhero-list.component.css']
})
export class SuperheroListComponent implements OnInit {
  heroes: Superhero[] = [];
  loading = true;
  error = '';
  searchTerm = '';
  searchType = 'name'; // Default search type: 'name' or 'id'
  
  // Pagination properties
  pageSize = 9;
  currentPage = 1;
  
  constructor(private superheroService: SuperheroService) {}

  ngOnInit(): void {
    // Page is rendered immediately with loading state
    // Load heroes in the background
    this.loadHeroes();
  }
  
  get totalPages(): number {
    return Math.ceil(this.heroes.length / this.pageSize);
  }
  
  get startIndex(): number {
    return (this.currentPage - 1) * this.pageSize;
  }
  
  get endIndex(): number {
    const end = this.startIndex + this.pageSize;
    return end > this.heroes.length ? this.heroes.length : end;
  }
  
  get paginatedHeroes(): Superhero[] {
    return this.heroes.slice(this.startIndex, this.endIndex);
  }
  
  getPageNumbers(): number[] {
    const totalPages = this.totalPages;
    const currentPage = this.currentPage;
    
    // Show at most 5 page numbers
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    // Always include first, last, and pages around current
    if (currentPage <= 3) {
      return [1, 2, 3, 4, 5];
    } else if (currentPage >= totalPages - 2) {
      return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    } else {
      return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
    }
  }
  
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      // Scroll to top of the hero grid
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  loadHeroes(): void {
    this.loading = true;
    this.error = '';
    this.currentPage = 1; // Reset to first page when loading new heroes
    
    this.superheroService.getAllSuperheroes()
      .pipe(
        finalize(() => {
          // This ensures loading is set to false even if there's an error
          this.loading = false;
        })
      )
      .subscribe({
        next: (heroes) => {
          this.heroes = heroes;
          
          if (heroes.length === 0) {
            console.warn('No heroes were loaded from the API');
            this.error = 'No heroes were found. The API might be experiencing issues.';
          } else {
            console.log(`Successfully loaded ${heroes.length} heroes`);
          }
        },
        error: (err) => {
          this.error = 'Failed to load superheroes. Please try again later.';
          console.error('Error loading superheroes:', err);
        }
      });
  }

  searchHeroes(): void {
    if (!this.searchTerm.trim()) {
      this.loadHeroes();
      return;
    }

    this.loading = true;
    this.error = '';
    this.currentPage = 1; // Reset to first page when searching
    
    // Determine search type
    if (this.searchType === 'id' || (this.searchType === 'auto' && /^\d+$/.test(this.searchTerm.trim()))) {
      this.searchById();
    } else {
      this.searchByName();
    }
  }
  
  private searchById(): void {
    this.superheroService.getSuperheroById(this.searchTerm.trim()).pipe(
      catchError(error => {
        console.error('Error searching by ID:', error);
        return of(null);
      }),
      finalize(() => {
        this.loading = false;
      })
    ).subscribe(hero => {
      if (hero && hero.id) {
        this.heroes = [hero];
      } else {
        this.heroes = [];
        this.error = `No hero found with ID "${this.searchTerm}"`;
      }
    });
  }
  
  private searchByName(): void {
    this.superheroService.searchSuperheroByName(this.searchTerm).pipe(
      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
      next: (heroes) => {
        this.heroes = heroes;
        
        if (heroes.length === 0) {
          this.error = `No heroes found matching name "${this.searchTerm}"`;
        }
      },
      error: (err) => {
        this.error = 'Failed to search superheroes by name. Please try again later.';
        console.error('Error searching superheroes by name:', err);
      }
    });
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.searchType = 'name';
    this.loadHeroes();
  }
} 