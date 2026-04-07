import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../shared/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {

     // ✅ Check if user is logged in
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
      return false;
    }

     // ✅ Check role
    const role = this.authService.getRole();

    if (role === 'admin') {
      return true;
    }

     // ❌ Not admin → redirect
    this.router.navigate(['/']);
    return false;
  }
}
