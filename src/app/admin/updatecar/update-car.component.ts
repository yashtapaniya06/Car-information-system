import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ApiService } from '../../shared/api.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  selector: 'app-update-car',
  templateUrl: './update-car.component.html',
  styleUrls: ['./update-car.component.css'],
})
export class UpdateCarComponent implements OnInit {
  updateForm: FormGroup;
  priceUnit: string = 'Lakhs';
  carId: string;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) {
    this.carId = this.route.snapshot.paramMap.get('id')!;
    console.log('=== UPDATE CAR COMPONENT DEBUG ===');
    console.log('Car ID from route:', this.carId);
    console.log('Route snapshot:', this.route.snapshot);
    console.log('ParamMap:', this.route.snapshot.paramMap);
    
    this.updateForm = this.fb.group({
      model: [{ value: '', disabled: true }],
      brand: [{ value: '', disabled: true }],
      priceRange: ['', Validators.required],
      year: [
        null,
        [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear())],
      ],
      fuelTypes: this.fb.array([], [Validators.required, Validators.minLength(1)]),
      mileage: ['', Validators.required],
      transmission: ['', Validators.required],
      engineCapacity: ['', Validators.required],
      seatingCapacity: [null, [Validators.required, Validators.min(1)]],
      bodyType: ['', Validators.required],
      bootSpace: [null, [Validators.required, Validators.min(1)]],
      safetyFeatures: ['', Validators.required],
      features: ['', Validators.required],
      warranty: ['', Validators.required],
      description: ['', Validators.required],
      image1: ['', Validators.required],
      image2: ['', Validators.required],
    });
  }

  // Getter for fuel types FormArray
  get fuelTypes() {
    return this.updateForm.get('fuelTypes') as FormArray;
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

  ngOnInit(): void {
    console.log('=== UPDATE CAR NG ON INIT ===');
    console.log('Fetching car data for ID:', this.carId);
    
    this.apiService.getCarById(this.carId).subscribe({
      next: (data) => {
        console.log('Car data fetched successfully:', data);
        
        // Handle price range extraction
        const priceStr = data.price || '';
        let priceRange = '';
        if (priceStr.includes('1-5') || (parseFloat(priceStr.replace(/[^\d.]/g, '')) >= 1 && parseFloat(priceStr.replace(/[^\d.]/g, '')) <= 5)) {
          priceRange = '1-5';
        } else if (priceStr.includes('5-10') || (parseFloat(priceStr.replace(/[^\d.]/g, '')) > 5 && parseFloat(priceStr.replace(/[^\d.]/g, '')) <= 10)) {
          priceRange = '5-10';
        } else if (priceStr.includes('10-15') || (parseFloat(priceStr.replace(/[^\d.]/g, '')) > 10 && parseFloat(priceStr.replace(/[^\d.]/g, '')) <= 15)) {
          priceRange = '10-15';
        } else if (priceStr.includes('15-20') || (parseFloat(priceStr.replace(/[^\d.]/g, '')) > 15 && parseFloat(priceStr.replace(/[^\d.]/g, '')) <= 20)) {
          priceRange = '15-20';
        } else if (priceStr.includes('20-30') || (parseFloat(priceStr.replace(/[^\d.]/g, '')) > 20 && parseFloat(priceStr.replace(/[^\d.]/g, '')) <= 30)) {
          priceRange = '20-30';
        } else if (priceStr.includes('30-50') || (parseFloat(priceStr.replace(/[^\d.]/g, '')) > 30 && parseFloat(priceStr.replace(/[^\d.]/g, '')) <= 50)) {
          priceRange = '30-50';
        } else if (parseFloat(priceStr.replace(/[^\d.]/g, '')) > 50) {
          priceRange = '50+';
        }

        // Handle fuel types array
        const fuelTypeStr = data.fuelType || '';
        const fuelTypes = fuelTypeStr.split(',').map((f: string) => f.trim()).filter((f: string) => f);
        
        // Clear existing fuel types and add new ones
        this.fuelTypes.clear();
        fuelTypes.forEach((fuelType: string) => {
          this.fuelTypes.push(this.fb.control(fuelType));
        });

        console.log('Patching form with data...');
        // Create a clean data object without fuelType since we handle fuelTypes separately
        const cleanData = {
          model: data.model,
          brand: data.brand,
          priceRange: priceRange,
          year: data.year,
          mileage: data.mileage,
          transmission: data.transmission,
          engineCapacity: data.engineCapacity,
          seatingCapacity: data.seatingCapacity,
          bodyType: data.bodyType,
          bootSpace: data.bootSpace,
          safetyFeatures: Array.isArray(data.safetyFeatures)
            ? data.safetyFeatures.join(', ')
            : data.safetyFeatures || '',
          features: Array.isArray(data.features) ? data.features.join(', ') : data.features || '',
          warranty: data.warranty,
          description: data.description,
          image1: data.image && data.image[0] ? data.image[0] : '',
          image2: data.image && data.image[1] ? data.image[1] : '',
        };
        this.updateForm.patchValue(cleanData);
        console.log('Form patched successfully');
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error fetching car data:', err);
        console.error('Error status:', err?.status);
        console.error('Error message:', err?.error?.error || err?.error?.message);
        this.loading = false;
        this.cdr.markForCheck();
        alert('Error loading car data: ' + (err?.error?.error || err?.error?.message || 'Unknown error'));
      },
    });
  }

  onSubmit(): void {
    if (this.updateForm.invalid) {
      this.updateForm.markAllAsTouched();
      return;
    }

    const formData = this.updateForm.getRawValue();
    const updatedCarData = {
      ...formData,
      price: formData.priceRange, // Use priceRange as price
      fuelType: formData.fuelTypes.join(', '), // Convert array to string for compatibility
      safetyFeatures:
        typeof formData.safetyFeatures === 'string'
          ? formData.safetyFeatures
              .split(',')
              .map((f: string) => f.trim())
              .filter((f: string) => f)
          : formData.safetyFeatures,
      features:
        typeof formData.features === 'string'
          ? formData.features
              .split(',')
              .map((f: string) => f.trim())
              .filter((f: string) => f)
          : formData.features,
      image: [formData.image1, formData.image2].filter((img) => img),
    };

    this.apiService.updateCar(this.carId, updatedCarData).subscribe({
      next: () => {
        alert('Car updated successfully!');
        this.cdr.markForCheck();
        this.router.navigate(['/admin/car-manage']);
      },
      error: (err) => {
        console.error('Error updating car:', err);
        alert(err.error?.error || 'Error updating car');
        this.cdr.markForCheck();
      },
    });
  }
}
