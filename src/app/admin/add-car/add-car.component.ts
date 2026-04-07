import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ApiService } from '../../shared/api.service';

@Component({
  selector: 'app-add-car',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './add-car.component.html',
  styleUrls: ['./add-car.component.css'],
})
export class AddCarComponent {
  carForm: any;
  modelExists = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {
    this.carForm = this.fb.group({
      model: ['', Validators.required],
      brand: ['', Validators.required],
      priceRange: ['', Validators.required],
      year: [
        null,
        [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear())],
      ],
      fuelTypes: this.fb.array([], [Validators.required, Validators.minLength(1)]),
      transmission: ['', Validators.required],
      seatingCapacity: ['', Validators.required],
      bodyType: ['', Validators.required],
      mileage: ['', Validators.required],
      engineCapacity: ['', Validators.required],
      bootSpace: [null, [Validators.required, Validators.min(0)]],
      safetyFeatures: ['', Validators.required],
      features: ['', Validators.required],
      warranty: ['', Validators.required],
      description: ['', Validators.required],
      image1: ['', Validators.required],
      image2: [''],
    });
  }

  // Getter for fuel types FormArray
  get fuelTypes() {
    return this.carForm.get('fuelTypes') as FormArray;
  }

  // Helper method to handle checkbox changes
  onFuelTypeChange(event: any, fuelType: string) {
    const checked = event.target.checked;
    const fuelTypesArray = this.fuelTypes;
    
    if (checked) {
      fuelTypesArray.push(this.fb.control(fuelType));
    } else {
      const index = fuelTypesArray.controls.findIndex(control => control.value === fuelType);
      if (index >= 0) {
        fuelTypesArray.removeAt(index);
      }
    }
  }

  // Helper method to check if a fuel type is selected
  isFuelTypeSelected(fuelType: string): boolean {
    return this.fuelTypes.controls.some(control => control.value === fuelType);
  }

  get f() {
    return this.carForm.controls;
  }

  checkModelAvailability(): void {
    const model = this.f.model.value?.trim();
    if (!model) return;
    // For now, we'll skip model checking since API service doesn't have this method
    // You can implement this later if needed
    this.modelExists = false;
    this.cdr.markForCheck();
  }

  preventMinus(event: KeyboardEvent): void {
    if (event.code === 'Minus') event.preventDefault();
  }

  onSubmit(): void {
    console.log('=== SUBMIT STARTED ===');
    console.log('Submit button clicked!');
    console.log('Form validity:', this.carForm.valid);
    console.log('Form values:', this.carForm.value);
    console.log('Form errors:', this.carForm.errors);
    
    // Check individual field validity
    console.log('=== INDIVIDUAL FIELD VALIDITY ===');
    Object.keys(this.carForm.controls).forEach(key => {
      const control = this.carForm.get(key);
      console.log(`${key}: valid=${control.valid}, errors=${JSON.stringify(control.errors)}, value=${control.value}`);
    });
    
    // Restore proper validation
    if (this.carForm.invalid) {
      console.log('Form is invalid, marking all as touched');
      this.carForm.markAllAsTouched();
      alert('Please fill all required fields before submitting!');
      return;
    }
    
    console.log('Form is valid, preparing payload...');
    const value = { ...this.carForm.value } as any;
    
    // Additional validation for empty critical fields
    if (!value.model || !value.brand || !value.priceRange || !value.fuelTypes || value.fuelTypes.length === 0 || !value.transmission) {
      console.log('Critical fields are empty');
      console.log('Model:', value.model);
      console.log('Brand:', value.brand);
      console.log('Price Range:', value.priceRange);
      console.log('Fuel Types:', value.fuelTypes);
      console.log('Transmission:', value.transmission);
      alert('Please fill all required fields: Model, Brand, Price Range, Fuel Types, and Transmission!');
      return;
    }
    
    console.log('All validations passed, creating payload...');
    const payload = { 
      ...value, 
      price: value.priceRange, // Use priceRange as price
      fuelType: value.fuelTypes.join(', '), // Convert array to string for compatibility
      image: [value.image1, value.image2].filter((img: string) => img),
      safetyFeatures: value.safetyFeatures ? value.safetyFeatures.split(',').map((f: string) => f.trim()).filter((f: string) => f) : [],
      features: value.features ? value.features.split(',').map((f: string) => f.trim()).filter((f: string) => f) : []
    };
    
    console.log('Final payload to send:', payload);
    console.log('Calling API service...');

    this.apiService.addCar(payload).subscribe({
      next: (response) => {
        console.log('API SUCCESS - Car added successfully:', response);
        console.log('Response type:', typeof response);
        console.log('Response keys:', Object.keys(response || {}));
        alert('Car Added Successfully');
        this.cdr.markForCheck();
        console.log('Navigating to car-manage...');
        this.router.navigate(['/admin/car-manage']).then(() => {
          console.log('Navigation completed');
        }).catch(err => {
          console.error('Navigation error:', err);
        });
      },
      error: (err: any) => {
        console.error('API ERROR - Error adding car:', err);
        console.error('Error status:', err?.status);
        console.error('Error message:', err?.error?.error || err?.error?.message || 'Unknown error');
        alert(err?.error?.error || err?.error?.message || 'Failed to add car');
        this.cdr.markForCheck();
      },
    });
  }
}
