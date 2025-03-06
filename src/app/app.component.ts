import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit {
  title = 'SuperHeros';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit() {
    // Only execute in browser environment
    if (isPlatformBrowser(this.platformId)) {
      // Add mobile menu toggle functionality
      const menuToggle = document.getElementById('menuToggle');
      const navMenu = document.getElementById('navMenu');
      
      if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
          navMenu.classList.toggle('active');
        });
      }
    }
  }
}
