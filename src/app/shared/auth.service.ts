import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap, of, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = environment.apiUrl;
  private isBrowser: boolean;
  private authStateSubject = new BehaviorSubject<{
    isLoggedIn: boolean;
    userName: string;
    userId: string | null;
    role: string | null;
  }>({
    isLoggedIn: false,
    userName: '',
    userId: null,
    role: null
  });

  authState$ = this.authStateSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  // REGISTER
  register(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register`, userData);
  }

  // LOGIN
  login(loginData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/auth/login`, loginData).pipe(
      tap(res => {
        if (res?.token) this.saveToken(res.token);
        if (res?.user?.role) this.saveRole(res.user.role);
        
        // Emit auth state change
        this.authStateSubject.next({
          isLoggedIn: true,
          userName: res?.user?.email || '',
          userId: res?.user?.id || null,
          role: res?.user?.role || null
        });
      })
    );
  }

  private saveToken(token: string): void {
    if (this.isBrowser) {
      localStorage.setItem('token', token);
    }
  }

  saveRole(role: string): void {
    if (this.isBrowser) {
      localStorage.setItem('role', role);
    }
  }

  getToken(): string | null {
    return this.isBrowser ? localStorage.getItem('token') : null;
  }

  getRole(): string | null {
    return this.isBrowser ? localStorage.getItem('role') : null;
  }

  private getAuthHeaders() {
    const token = this.getToken();
    if (!token) {
      return {};
    }

    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
    }
    
    // Emit auth state change
    this.authStateSubject.next({
      isLoggedIn: false,
      userName: '',
      userId: null,
      role: null
    });
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  checkAuth(): Observable<{
    isLoggedIn: boolean;
    userName?: string;
    userId?: string | null;
    role?: string | null;
  }> {
    const token = this.getToken();

    if (!token) {
      return of({
        isLoggedIn: false,
        userName: '',
        userId: null,
        role: null
      });
    }

    return this.http.get<{
      isLoggedIn: boolean;
      userName?: string;
      userId?: string | null;
      role?: string | null;
    }>(`${this.baseUrl}/auth/check`, this.getAuthHeaders());
  }

  checkAdmin(): Observable<{ isadmin: boolean }> {
    const token = this.getToken();

    if (!token) {
      return of({ isadmin: false });
    }

    return this.http.get<{ isadmin: boolean }>(
      `${this.baseUrl}/auth/admin/check`,
      this.getAuthHeaders()
    );
  }

  logoutRequest(): Observable<void> {
    const token = this.getToken();

    if (!token) {
      return of(void 0);
    }

    return this.http.post<void>(
      `${this.baseUrl}/auth/logout`,
      {},
      this.getAuthHeaders()
    );
  }
}