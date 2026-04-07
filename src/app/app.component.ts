import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, NgIf } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { AuthService } from './shared/auth.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, NgIf],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  isAdminRoute = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit(): void {
    this.setIsAdminRoute(this.router.url);

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.setIsAdminRoute(event.urlAfterRedirects);
      });

    // Auto-logout when page/tab closes
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('beforeunload', () => {
        this.authService.logout();
      });
    }
  }

  private setIsAdminRoute(url: string): void {
    // Hide the public header/footer for all admin pages (dashboard and children).
    this.isAdminRoute = url.startsWith('/admin');
  }
}
