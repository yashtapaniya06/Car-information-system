import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserAuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(_: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | UrlTree {
    const loginRedirect = this.router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url || '/cars' }
    });

    if (!this.authService.isLoggedIn()) {
      return loginRedirect;
    }

    return this.authService.checkAuth().pipe(
      map((data) => {
        if (data.isLoggedIn) {
          if (data.role) {
            this.authService.saveRole(data.role);
          }

          return true;
        }

        this.authService.logout();
        return loginRedirect;
      }),
      catchError(() => {
        this.authService.logout();
        return of(loginRedirect);
      })
    );
  }
}

