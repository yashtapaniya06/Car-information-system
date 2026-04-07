import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Car {
  id?: string;
  name: string;
  brand: string;
  price: number;
  imageUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CarService {

  private baseUrl = 'http://localhost:5000/api/car';

  constructor(private http: HttpClient) {}

  // 🔹 Get all cars
  getCars(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  // 🔹 Get car by ID
  getCarById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  // 🔹 Add car (Admin)
  addCar(car: Car): Observable<any> {
    return this.http.post(this.baseUrl, car);
  }

  // 🔹 Update car (Admin)
  updateCar(id: string, car: Car): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, car);
  }

  // 🔹 Delete car (Admin)
  deleteCar(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  // 🔹 Featured cars
  getFeatured(): Observable<any> {
    return this.http.get(`${this.baseUrl}/featured`);
  }

  // 🔹 Car count
  getCarCount(): Observable<any> {
    return this.http.get(`${this.baseUrl}/count`);
  }
}