import { Component, Inject, OnInit, OnDestroy, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  slideImages = [
    { url: 'assets/assets/cars/car1.jpg', caption: 'Slide 1' },
    { url: 'assets/assets/cars/car2.jpeg', caption: 'Slide 2' },
    { url: 'assets/assets/cars/car3.jpeg', caption: 'Slide 3' },
    { url: 'assets/assets/cars/car4.jpg', caption: 'Slide 3' }
  ];

  brandSlides = [
    { url: 'assets/assets/brandlogo1.jpg', caption: 'Slide 1' },
    { url: 'assets/assets/brandlogo2.jpg', caption: 'Slide 2' }
  ];

  featuredCars: any[] = [];
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.slideImages = [...this.slideImages, ...this.slideImages];
    this.brandSlides = [...this.brandSlides, ...this.brandSlides];

    if (this.isBrowser) {
      this.getFeaturedCars();
    }
  }

  ngOnDestroy(): void {}

  // 🔹 FEATURED CARS
  getFeaturedCars() {
    this.http.get<any>('http://localhost:5000/api/cars/featured')
      .subscribe({
        next: (res) => {
          this.featuredCars = Array.isArray(res) ? res : (res?.data || []);
        },
        error: (err) => {
          console.error('Featured cars error:', err);
          this.featuredCars = [];
        }
      });
  }

  // 🔹 NAVIGATION
  viewCarDetails(car: any): void {
    const carId = car._id || car.id;
    if (carId) {
      this.router.navigate(['/car', carId]);
    } else {
      console.error('Car ID not found for navigation.', car);
    }
  }
}
  
// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { CommonModule } from '@angular/common';
// import { Subscription, interval } from 'rxjs';

// @Component({
//   standalone: true,
//   imports: [CommonModule],
//   selector: 'app-home',
//   templateUrl: './home.component.html',
//   styleUrls: ['./home.component.css']
// })
// export class HomeComponent implements OnInit, OnDestroy {

//   // 🔹 SLIDER
//   slideImages = [
//     { url: 'assets/cars/car1.jpg', caption: 'Slide 1' },
//     { url: 'assets/cars/car2.jpg', caption: 'Slide 2' },
//     { url: 'assets/cars/car3.jpg', caption: 'Slide 3' },
//   ];

//   currentSlideIndex = 0;
//   slideSub!: Subscription;

//   // 🔹 DATA
//   featuredCars: any[] = [];
//   topCars: any[] = [];
//   chartData: any[] = [];

//   private API = 'http://localhost:5000';

//   constructor(private http: HttpClient) {}

//   // ===============================
//   ngOnInit(): void {
//     this.loadHomeData();
//     this.startSlideshow();
//   }

//   ngOnDestroy(): void {
//     if (this.slideSub) this.slideSub.unsubscribe();
//   }

//   // ===============================
//   // 🔥 LOAD ALL HOME DATA (ONLY ONCE)
//   loadHomeData() {
//     this.getFeaturedCars();
//     this.getRatingAnalysis();
//   }

//   // ===============================
//   // 🔹 FEATURED CARS
//   getFeaturedCars() {
//     this.http.get<any[]>(`${this.API}/api/cars/featured`)
//       .subscribe({
//         next: (data) => {
//           this.featuredCars = data || [];
//           console.log("✅ Featured cars:", data);
//         },
//         error: (err) => {
//           console.error("❌ Featured error:", err);
//           this.featuredCars = [];
//         }
//       });
//   }

//   // ===============================
//   // 🔹 ANALYSIS
//   getRatingAnalysis() {
//     this.http.get<any>(`${this.API}/analysis`)
//       .subscribe({
//         next: (data) => {
//           this.topCars = data?.topCars || [];
//           this.chartData = data?.chartData || [];
//           console.log("✅ Analysis:", data);
//         },
//         error: (err) => {
//           console.error("❌ Analysis error:", err);
//           this.topCars = [];
//         }
//       });
//   }

//   // ===============================
//   // 🔹 SLIDER
//   startSlideshow(): void {
//     this.slideSub = interval(3000).subscribe(() => {
//       this.currentSlideIndex =
//         (this.currentSlideIndex + 1) % this.slideImages.length;
//     });
//   }
// }
