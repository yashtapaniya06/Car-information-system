import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule  } from '@angular/common';


@Component({
  selector: 'app-car-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './car-card.component.html',
  styleUrls: ['./car-card.component.css']
})
export class CarCardComponent {
  @Input() id!: string;
  @Input() image!: string[];
  @Input() title!: string;
  @Input() description!: string;
  @Input() price!: string;
  @Input() year!: number;
  @Input() fuelType!: string;
  @Input() mileage!: number;

  constructor(private router: Router) {}

  handleViewMore(): void {
    // Check if ID exists, if not use a default or show error
    if (this.id) {
      this.router.navigate(['/car', this.id]);
    } else {
      console.error('Car ID is undefined, cannot navigate');
      // Optionally show an alert or handle the error gracefully
      alert('Car information not available');
    }
  }

  truncate(text: string, length: number): string {
    if (!text || text.length > length) {
      return text ? text.substring(0, length) + '...' : '';
    }
    return text;
  }
}