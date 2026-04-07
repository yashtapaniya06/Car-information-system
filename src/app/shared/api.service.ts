import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ================= TOKEN HEADER =================
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  // ================= AUTH =================

  login(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, data);
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register`, data);
  }

  // ================= CARS =================

  getCars(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/cars`);
  }

  getCarById(id: string): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/cars/${encodeURIComponent(id)}`,
      this.getAuthHeaders()
    );
  }

  addCar(data: any): Observable<any> {
    const token = localStorage.getItem('token');
    console.log('=== ADD CAR DEBUG ===');
    console.log('Token from localStorage:', token);
    console.log('Data being sent:', data);
    console.log('Full URL:', `${this.baseUrl}/cars`);
    
    const headers = this.getAuthHeaders();
    console.log('Auth headers:', headers);
    
    return this.http.post(
      `${this.baseUrl}/cars`,
      data,
      headers
    );
  }

  updateCar(id: string, data: any): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/cars/${encodeURIComponent(id)}`,
      data,
      this.getAuthHeaders()
    );
  }

  deleteCar(id: string): Observable<any> {
    return this.http.delete(
      `${this.baseUrl}/cars/${encodeURIComponent(id)}`,
      this.getAuthHeaders()
    );
  }

  // ================= USERS =================

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/users`,
      this.getAuthHeaders()
    );
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(
      `${this.baseUrl}/users/${encodeURIComponent(id)}`,
      this.getAuthHeaders()
    );
  }

  // ================= RATINGS =================

  getRatings(carId: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/ratings/${encodeURIComponent(carId)}`
    );
  }

  addRating(data: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/ratings`,
      data,
      this.getAuthHeaders()
    );
  }

  // ================= CONTACT =================

  getContacts(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/contacts`,
      this.getAuthHeaders()
    );
  }

  addContact(data: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/contact`,
      data,
      this.getAuthHeaders()
    );
  }

  // ================= COUNTS =================

  getUserCount(): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/users/count`,
      this.getAuthHeaders()
    );
  }

  getCarCount(): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/cars/count`,
      this.getAuthHeaders()
    );
  }
}
