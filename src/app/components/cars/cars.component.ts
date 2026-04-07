import { ChangeDetectorRef, Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirestoreService } from '../../shared/firestore.service';
import { AuthService } from '../../shared/auth.service';

interface Car {
  id?: string;
  _id?: string;
  brand: string;
  model: string;
  image?: string[];   // normalized image array
  image1?: string;    // raw fields from DB (for older data)
  image2?: string;    
  image3?: string;    
  price: string;
  year: number;
  fuelType: string;
  mileage: string;
  description: string;
}

@Component({ 
  selector: 'app-cars',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.css']
})
export class CarsComponent implements OnInit {

  originalCarsData: Car[] = [];
  carsData: Car[] = [];

  brands: string[] = [];
  models: string[] = [];

  selectedBrand = '';
  selectedModel = '';
  selectedPriceRange = '';
  selectedFuelType = '';

  currentPage = 1;
  carsPerPage = 12;

  loading = true;

  constructor(
    @Inject(FirestoreService) private fs: FirestoreService,
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchCarData();
  }

  fetchCarData(): void {
    this.fs.getCars().subscribe({
      next: (data: any) => {
        const cars = Array.isArray(data) ? data as Car[] : (data?.data || []);

        const normalized = (cars || []).map((c: Car) => {
          const images: string[] = Array.isArray(c.image)
            ? c.image
            : [c.image1, c.image2, c.image3].filter((img: string | undefined) => !!img) as string[];

          return {
            ...c,
            id: c.id || c._id,
            image: images
          };
        });

        this.originalCarsData = normalized;
        this.carsData = normalized;

        this.brands = [...new Set(this.originalCarsData.map(c => c.brand))];
        this.models = [...new Set(this.originalCarsData.map(c => c.model))];

        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error("Firestore error:", err);
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  onBrandChange(): void {
    this.selectedModel = '';

    if (this.selectedBrand) {
      this.models = [...new Set(
        this.originalCarsData
          .filter(c => c.brand === this.selectedBrand)
          .map(c => c.model)
      )];
    } else {
      this.models = [...new Set(this.originalCarsData.map(c => c.model))];
    }

    this.applyFilters();
  }

  private parsePrice(priceStr: string): number {
    if (!priceStr) return 0;

    let num = parseFloat(priceStr.replace(/[^\d.]/g, ''));

    if (priceStr.toLowerCase().includes("crore")) return num * 10000000;
    if (priceStr.toLowerCase().includes("lakh")) return num * 100000;

    return num;
  }

  applyFilters(): void {
    this.carsData = this.originalCarsData.filter(car => {

      const brandMatch = !this.selectedBrand || car.brand === this.selectedBrand;
      const modelMatch = !this.selectedModel || car.model === this.selectedModel;
      const fuelMatch = !this.selectedFuelType || car.fuelType === this.selectedFuelType;

      const price = this.parsePrice(car.price);
      let priceMatch = true;

      switch (this.selectedPriceRange) {
        case "1-10": priceMatch = price >= 100000 && price <= 1000000; break; // 1-10 lakh
        case "11-20": priceMatch = price > 1000000 && price <= 2000000; break; // 11-20 lakh
        case "10-15": priceMatch = price > 1500000 && price <= 2500000; break;
        case "15-20": priceMatch = price > 2500000 && price <= 3000000; break;
        case "20-25": priceMatch = price > 3000000 && price <= 3500000; break;
        case "25-50": priceMatch = price > 3500000 && price <= 5000000; break;
        case "50-100": priceMatch = price > 5000000 && price <= 10000000; break;
        case "1-2cr": priceMatch = price > 10000000 && price <= 20000000; break;
        case "2-5cr": priceMatch = price > 20000000 && price <= 50000000; break;
        case "above-5cr": priceMatch = price > 50000000; break;
      }

      return brandMatch && modelMatch && fuelMatch && priceMatch;
    });

    this.currentPage = 1;
  }

  clearFilters(): void {
    this.selectedBrand = '';
    this.selectedModel = '';
    this.selectedFuelType = '';
    this.selectedPriceRange = '';

    this.carsData = [...this.originalCarsData];
    this.models = [...new Set(this.originalCarsData.map(c => c.model))];

    this.currentPage = 1;
  }

  get paginatedCars(): Car[] {
    const start = (this.currentPage - 1) * this.carsPerPage;
    return this.carsData.slice(start, start + this.carsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.carsData.length / this.carsPerPage);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    window.scrollTo({ top: 400, behavior: 'smooth' });
  }

  viewCar(car: Car): void {
    // Require login before viewing details
    if (!this.authService.isLoggedIn()) {
      alert('Please login to view car details.');
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/cars' } });
      return;
    }

    const id = car.id || car._id;
    if (!id) {
      console.error('No car id found for navigation', car);
      return;
    }
    this.router.navigate(['/car', id]);
  }
}
