import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthService } from '../../shared/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  selector: 'app-sign-up',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class SignUpComponent implements AfterViewInit {
  signUpForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {
    this.signUpForm = this.fb.group({
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  ngAfterViewInit(): void {
    this.resetForm();
  }

  onSubmit(): void {
    if (this.signUpForm.valid) {
      const { userName, email, password, confirmPassword } = this.signUpForm.value;

      if (password !== confirmPassword) {
        this.errorMessage = "Confirm Password doesn't match";
        return;
      }

      this.isLoading = true;
      this.errorMessage = '';

      this.authService
        .register({
          userName,
          email,
          password,
        })
        .subscribe({
          next: (result) => {
            this.isLoading = false;
            this.cdr.markForCheck();
            alert('Registration successful! Please login.');
            this.router.navigate(['/']);
          },
          error: (error) => {
            this.isLoading = false;
            console.error('Error during signup:', error);
            this.errorMessage = error.error?.error || 'An error occurred during signup.';
            this.cdr.markForCheck();
          },
        });
    } else {
      this.signUpForm.markAllAsTouched();
    }
  }

  private resetForm(): void {
    const clearForm = () => {
      this.signUpForm.reset(
        {
          userName: '',
          email: '',
          password: '',
          confirmPassword: '',
        },
        { emitEvent: false },
      );
    };

    setTimeout(clearForm);
    setTimeout(clearForm, 150);
  }
}
