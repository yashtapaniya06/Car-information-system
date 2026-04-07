import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CarCardComponent } from '../car/car-card.component';
import { ApiService } from '../../shared/api.service';

interface Car {
  id?: string;
  _id?: string;
  brand: string;
  model: string;
  image: string[];
  description: string;
  price: string;
  year: number;
  fuelType: string;
  mileage: number;
}

@Component({
  selector: 'app-car-manage',
  standalone: true,
  imports: [CommonModule, CarCardComponent],
  templateUrl: './car-manage.component.html',
  styleUrls: ['./car-manage.component.css'],
})
export class CarManageComponent implements OnInit {
  cars: Car[] = [];
  filteredCars: Car[] = [];
  open = false;
  carIdToDelete: string | null = null;
  loading = true;

  // Filter properties
  brandFilter: string = '';
  modelFilter: string = '';
  fuelTypeFilter: string = '';
  priceRangeFilter: string = '';

  constructor(
    private apiService: ApiService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  trackByCarId(index: number, car: Car): string {
    // Use a combination of index and ID to ensure uniqueness
    return car._id || car.id || `car-${index}`;
  }

  ngOnInit(): void {
    this.fetchCarData();
  }

  fetchCarData(): void {
    console.log('=== FETCHING CAR DATA ===');
    this.loading = true;
    this.apiService.getCars().subscribe({
      next: (data) => {
        console.log('API Response:', data);
        console.log('Data type:', typeof data);
        console.log('Data length:', data?.length);
        this.cars = data || [];
        console.log('Cars array after assignment:', this.cars);
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error fetching car data:', err);
        console.error('Error status:', err?.status);
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }

  openDeleteDialog(id: string): void {
    this.open = true;
    this.carIdToDelete = id;
  }

  handleClose(): void {
    this.open = false;
    this.carIdToDelete = null;
  }

  handleConfirmDelete(): void {
    if (this.carIdToDelete) {
      this.apiService.deleteCar(this.carIdToDelete).subscribe({
        next: () => {
          alert('Car Deleted Successfully');
          this.cars = this.cars.filter((car) => {
            const carId = car.id || car._id;
            return carId !== this.carIdToDelete;
          });
          this.cdr.markForCheck();
          this.handleClose();
        },
        error: (err) => {
          console.error('Error deleting car data:', err);
          alert(err.error?.error || 'Error deleting car');
          this.cdr.markForCheck();
        },
      });
    }
  }

  navigateToUpdate(id: string): void {
    console.log('=== UPDATE CAR DEBUG ===');
    console.log('Car ID received:', id);
    console.log('ID type:', typeof id);
    console.log('ID length:', id?.length);
    
    if (!id) {
      console.error('Car ID is missing or empty');
      alert('Car ID is missing, cannot update');
      return;
    }
    
    console.log('Navigating to update page with ID:', id);
    this.router.navigate([`/admin/update-car/${id}`], { replaceUrl: true }).then(() => {
      console.log('Navigation to update page completed');
    }).catch(err => {
      console.error('Navigation error:', err);
      alert('Failed to navigate to update page');
    });
  }
}
