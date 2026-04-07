import { Component, OnInit, HostListener, ElementRef, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginModalComponent } from '../login-model/login-modal.component';
import { AuthService } from '../../shared/auth.service';
import { Subscription } from 'rxjs';


@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, LoginModalComponent],
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  isAdmin = false;
  username = '';
  loginOpen = false;
  isMenuOpen = false;
  logoPath = 'assets/Logo.png';
  private authSubscription: Subscription | null = null;

  constructor(
    private authService: AuthService,
    private eRef: ElementRef
  ) {}

  ngOnInit(): void {
    // Subscribe to auth state changes
    this.authSubscription = this.authService.authState$.subscribe(authState => {
      this.isLoggedIn = authState.isLoggedIn;
      this.username = authState.userName;
      this.isAdmin = authState.role === 'admin';
    });
    
    // Also check initial auth status
    this.checkLoginStatus();
    this.checkAdminStatus();
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isMenuOpen = false;
    }
  }

  checkLoginStatus(): void {
    this.authService.checkAuth().subscribe({
      next: (data: any) => {
        this.isLoggedIn = data.isLoggedIn || false;
        this.username = data.userName || '';
        if (data.role) {
          this.authService.saveRole(data.role);
        }
      },
      error: (err: any) => {
        console.error('Error checking login status:', err);
        this.isLoggedIn = false;
        this.username = '';
      }
    });
  }

  checkAdminStatus(): void {
    this.authService.checkAdmin().subscribe({
      next: (data: any) => {
        this.isAdmin = data.isadmin || false;
      },
      error: () => {
        this.isAdmin = false;
      }
    });
  }

  handlerLogout(): void {
    this.authService.logoutRequest().subscribe({
      next: () => {
        this.completeLogout();
      },
      error: (err: any) => {
        console.error(err);
        // Still logout locally even if request fails
        this.completeLogout();
      }
    });
  }

  private completeLogout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
    this.isAdmin = false;
    this.username = '';
    this.isMenuOpen = false;
    window.location.assign('/');
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  onLoginClose(): void {
    this.loginOpen = false;
    // Refresh auth status after login
    setTimeout(() => {
      this.checkLoginStatus();
      this.checkAdminStatus();
    }, 100);
  }
}
