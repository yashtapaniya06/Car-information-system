import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-car-card',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.css']
})
export class CarComponent {
  @Input() id!: string;
  @Input() image: string[] = [];
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() price: string = '';
  @Input() year: string | number = '';
  @Input() fuelType: string = '';
  @Input() mileage: string = '';

  constructor(private router: Router) {}

  handleViewMore(): void {
    this.router.navigate([`/carinfo/${this.id}`]);
  }

  truncate(description: string, length: number): string {
    if (description.length > length) {
      return description.substring(0, length) + '...';
    }
    return description;
  }
}