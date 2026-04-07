import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../shared/api.service';
import { FirestoreService } from '../../shared/firestore.service';

interface Car {
  id: string;
  brand: string;
  model: string;
  image?: string[];
  image1?: string;
  image2?: string;
  price: string;
  rating: number;
  ratingCount: number;
}

@Component({
  selector: 'app-car-rating-analysis',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './car-rating-analysis.component.html',
  styleUrls: ['./car-rating-analysis.component.css'],
})
export class CarRatingAnalysisComponent implements OnInit {
  topRatedCars: Car[] = [];
  loading = true;
  allCars: any[] = [];

  constructor(
    private apiService: ApiService,
    private firestoreService: FirestoreService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.fetchTopRatedCars();
  }

  fetchTopRatedCars(): void {
    this.loading = true;

    // Fetch all cars
    this.firestoreService.getCars().subscribe({
      next: (cars) => {
        this.allCars = cars || [];
        this.fetchAllRatings();
      },
      error: (err) => {
        console.error('Error fetching cars:', err);
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }

  fetchAllRatings(): void {
    // Fetch ratings for all cars and calculate top 3
    const ratingPromises: Promise<any>[] = [];

    this.allCars.forEach((car) => {
      const carId = car.id || car._id;
      ratingPromises.push(
        new Promise((resolve) => {
          this.apiService.getRatings(carId).subscribe({
            next: (ratings) => {
              resolve({ carId, carData: car, ratings });
            },
            error: () => {
              resolve({ carId, carData: car, ratings: [] });
            },
          });
        }),
      );
    });

    Promise.all(ratingPromises).then((results) => {
      // Calculate average rating for each car
      const carsWithRatings = results.map((result: any) => {
        const ratings = result.ratings || [];
        const car = result.carData;

        const avgRating =
          ratings.length > 0
            ? ratings.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) / ratings.length
            : 0;

        const images: string[] = Array.isArray(car.image)
          ? car.image
          : [car.image1, car.image2].filter((img: string | undefined) => !!img);

        return {
          id: result.carId,
          brand: car.brand,
          model: car.model,
          image: images,
          price: car.price,
          rating: avgRating,
          ratingCount: ratings.length,
        };
      });

      // Sort by rating (descending) and get top 3
      this.topRatedCars = carsWithRatings
        .filter((car) => car.ratingCount > 0) // Only show cars with ratings
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3);

      this.loading = false;
      this.cdr.markForCheck();
    });
  }

  getStarsArray(rating: number): number[] {
    const stars = [];
    const roundedRating = Math.round(rating);
    for (let i = 0; i < 5; i++) {
      stars.push(i < roundedRating ? 1 : 0);
    }
    return stars;
  }
}
