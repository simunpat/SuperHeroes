import { Routes } from '@angular/router';
import { SuperheroListComponent } from './superhero-list/superhero-list.component';
import { SuperheroDetailComponent } from './superhero-detail/superhero-detail.component';

export const routes: Routes = [
  { path: '', component: SuperheroListComponent },
  { path: 'hero/:id', component: SuperheroDetailComponent },
  { path: '**', redirectTo: '' }
];
