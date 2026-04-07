import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../shared/api.service';
import { AuthService } from '../../shared/auth.service';

@Component({
  standalone: true, 
  imports: [ReactiveFormsModule],
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  contactForm!: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.cdr.markForCheck();

    this.authService.checkAuth().subscribe({
      next: (data) => {
        if (!data.isLoggedIn) {
          this.authService.logout();
          this.isSubmitting = false;
          this.cdr.markForCheck();
          this.router.navigate(['/login'], { queryParams: { returnUrl: '/contact' } });
          return;
        }

        this.apiService.addContact(this.contactForm.value).subscribe({
          next: () => {
            alert('Message sent successfully');
            this.contactForm.reset();
            this.isSubmitting = false;
            this.cdr.markForCheck();
          },
          error: (err) => {
            console.error(err);

            if (err.status === 401) {
              this.authService.logout();
              this.router.navigate(['/login'], { queryParams: { returnUrl: '/contact' } });
            } else {
              alert(err.error?.error || 'Something went wrong');
            }

            this.isSubmitting = false;
            this.cdr.markForCheck();
          }
        });
      },
      error: (err) => {
        console.error('Error checking login status:', err);
        this.authService.logout();
        this.isSubmitting = false;
        this.cdr.markForCheck();
        this.router.navigate(['/login'], { queryParams: { returnUrl: '/contact' } });
      }
    });
  }
}
