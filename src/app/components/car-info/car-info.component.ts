import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../shared/api.service';
import { AuthService } from '../../shared/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  selector: 'app-car-info',
  templateUrl: './car-info.component.html',
  styleUrls: ['./car-info.component.css'],
})
export class CarInfoComponent implements OnInit {
  id: string | null = null;
  car: any = null;

  stars = [1, 2, 3, 4, 5];
  rating: number = 0;
  averageRating: number = 0;

  userId: string | null = null;
  isLoggedIn: boolean = false;
  authChecked = false;

  currentImageIndex: number = 0;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.checkLoginStatus();

    if (this.id) {
      this.fetchCarInfo();
      this.fetchRatings();
    } else {
      this.loading = false;
    }
  }

  fetchCarInfo(): void {
    if (!this.id) return;

    this.apiService.getCarById(this.id).subscribe({
      next: (data: any) => {
        const raw = data?.data ?? data;

        const images: string[] = Array.isArray(raw.image)
          ? raw.image
          : [raw.image1, raw.image2].filter((img: string) => !!img);

        this.car = {
          ...raw,
          image: images,
        };

        this.loading = false;
        this.cdr.markForCheck();
      },

      error: (err: any) => {
        console.error(err);
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }

  fetchRatings(): void {
    if (!this.id) return;

    this.apiService.getRatings(this.id).subscribe({
      next: (ratings: any[]) => {
        if (ratings.length > 0) {
          const sum = ratings.reduce((a, r) => a + (r.rating || 0), 0);
          this.averageRating = sum / ratings.length;

          if (this.userId) {
            const userRating = ratings.find((r) => r.userId === this.userId);

            if (userRating) {
              this.rating = userRating.rating;
            }
          }
        }

        this.cdr.markForCheck();
      },

      error: (err: any) => {
        console.error(err);
        this.cdr.markForCheck();
      },
    });
  }

  checkLoginStatus(): void {
    this.authService.checkAuth().subscribe({
      next: (data: any) => {
        this.isLoggedIn = data.isLoggedIn || false;
        this.userId = data.userId || null;
        this.authChecked = true;

        if (this.id) {
          this.fetchRatings();
        }

        this.cdr.markForCheck();
      },

      error: (err: any) => {
        console.error(err);
        this.authChecked = true;
        this.cdr.markForCheck();
      },
    });
  }

  onStarClick(star: number): void {
    if (!this.isLoggedIn) {
      alert('Please login to rate this car');
      return;
    }

    if (!this.id) return;

    this.rating = star;

    this.apiService
      .addRating({
        carId: this.id,
        rating: star,
      })
      .subscribe({
        next: () => {
          this.fetchRatings();
          this.cdr.markForCheck();
        },

        error: (err: any) => {
          alert('Rating failed');
          this.cdr.markForCheck();
        },
      });
  }

  nextImage(): void {
    if (this.car?.image) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.car.image.length;
    }
  }

  prevImage(): void {
    if (this.car?.image) {
      this.currentImageIndex =
        (this.currentImageIndex - 1 + this.car.image.length) % this.car.image.length;
    }
  }
}
