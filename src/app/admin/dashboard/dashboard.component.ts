import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../shared/api.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  userCount: number = 0;
  carCount: number = 0;
  loading = true;
  hoveredCard: string | null = null;

  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.loading = true;

    // Fetch total users
    this.apiService.getUserCount().subscribe({
      next: (data) => {
        this.userCount = data.totalUsers || 0;
        this.checkLoading();
      },
      error: (err) => {
        console.error('Error fetching user count:', err);
        this.checkLoading();
      },
    });

    // Fetch total cars
    this.apiService.getCarCount().subscribe({
      next: (data) => {
        this.carCount = data.totalCars || 0;
        this.checkLoading();
      },
      error: (err) => {
        console.error('Error fetching car count:', err);
        this.checkLoading();
      },
    });
  }

  private checkLoading(): void {
    // Simple loading check - in production, use RxJS combineLatest or forkJoin
    setTimeout(() => {
      this.loading = false;
      this.cdr.markForCheck();
    }, 500);
  }

  goToUsers(): void {
    this.router.navigate(['/admin/users']);
  }

  goToCarData(): void {
    this.router.navigate(['/admin/car-manage']);
  }

  goToRatings(): void {
    this.router.navigate(['/admin/ratings']);
  }

  onMouseEnter(cardName: string): void {
    this.hoveredCard = cardName;
  }

  onMouseLeave(): void {
    this.hoveredCard = null;
  }
}
