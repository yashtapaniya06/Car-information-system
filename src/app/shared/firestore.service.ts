import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  private apiUrl = 'http://localhost:5000/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getAuthHeaders() {
    const token = this.authService.getToken();
    if (!token) {
      return {};
    }

    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  }

  checkModel(model: string) {
    return this.http.get(`${this.apiUrl}/cars/check-model/${model}`);
  }

  getCars() {
    return this.http.get<any[]>(`${this.apiUrl}/cars`);
  }

  addCar(data: any) {
    return this.http.post(`${this.apiUrl}/cars`, data, this.getAuthHeaders());
  }

  updateCar(id: string, data: any) {
    return this.http.put(`${this.apiUrl}/cars/${id}`, data, this.getAuthHeaders());
  }

  deleteCar(id: string) {
    return this.http.delete(`${this.apiUrl}/cars/${id}`, this.getAuthHeaders());
  }
}
