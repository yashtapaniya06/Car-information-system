import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../shared/api.service';
import { AuthService } from '../../shared/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-rating-system',
  templateUrl: './rating-system.component.html',
  styleUrls: ['./rating-system.component.css']
})
export class RatingSystemComponent implements OnInit {
  id: string | null = null;
  car: any = null;
  rating: number = 0;
  userId: string | null = null;
  isLoggedIn: boolean = false;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.checkLoginStatus();
    if (this.id) {
      this.fetchCarInfo();
      this.fetchRatings();
    }
  }

  fetchCarInfo(): void {
    if (!this.id) return;
    
    this.loading = true;
    this.apiService.getCarById(this.id).subscribe({
      next: (data: any) => {
        this.car = data;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error fetching car data:', error);
        this.loading = false;
      }
    });
  }

  fetchRatings(): void {
    if (!this.id) return;
    
    this.apiService.getRatings(this.id).subscribe({
      next: (ratings: any[]) => {
        if (ratings && ratings.length > 0 && this.userId) {
          const userRating = ratings.find(r => r.userId === this.userId);
          if (userRating) {
            this.rating = userRating.rating;
          }
        }
      },
      error: (error: any) => {
        console.error('Error fetching ratings:', error);
      }
    });
  }

  checkLoginStatus(): void {
    this.authService.checkAuth().subscribe({
      next: (data: any) => {
        this.isLoggedIn = data.isLoggedIn || false;
        this.userId = data.userId || null;
      },
      error: (error: any) => {
        console.error('Error checking login status:', error);
        this.isLoggedIn = false;
        this.userId = null;
      }
    });
  }

  onStarClick(newRating: number): void {
    if (!this.isLoggedIn || !this.id) {
      alert("Please login to rate this car");
      return;
    }

    this.rating = newRating;
    this.apiService.addRating({
      carId: this.id,
      rating: newRating
    }).subscribe({
      next: () => {
        alert('Rating submitted successfully');
        this.fetchRatings(); // Refresh ratings
      },
      error: (err: any) => {
        alert(err.error?.error || err.error?.message || 'Error submitting rating');
      }
    });
  }
}
