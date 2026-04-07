import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../shared/auth.service';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.css'],
})
export class LoginModalComponent implements AfterViewInit {
  @Output() closeModal = new EventEmitter<void>();
  @ViewChild('emailInput') emailInput?: ElementRef<HTMLInputElement>;
  @ViewChild('passwordInput') passwordInput?: ElementRef<HTMLInputElement>;

  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngAfterViewInit(): void {
    this.resetForm();
    setTimeout(() => this.syncFormWithInputs());
  }

  onSubmit(): void {
    if (this.isLoading) {
      return;
    }

    this.syncFormWithInputs();

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;

    this.authService.login({ email, password }).subscribe({
      next: () => {
        const role = this.authService.getRole();
        const targetUrl = this.getPostLoginUrl(role);
        this.isLoading = false;
        this.closeModal.emit();
        this.router.navigateByUrl(targetUrl);
      },
      error: (error) => {
        console.error('Login error:', error);
        this.errorMessage = error.error?.error || 'Invalid credentials';
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  private getPostLoginUrl(role: string | null): string {
    if (role === 'admin') {
      return '/admin';
    }

    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    if (returnUrl) {
      return returnUrl;
    }

    return this.router.url.startsWith('/login') ? '/' : this.router.url;
  }

  private resetForm(): void {
    const clearForm = () => {
      this.loginForm.reset(
        {
          email: '',
          password: '',
        },
        { emitEvent: false },
      );
    };

    setTimeout(clearForm);
    setTimeout(clearForm, 150);
  }

  private syncFormWithInputs(): void {
    const email = this.emailInput?.nativeElement.value ?? '';
    const password = this.passwordInput?.nativeElement.value ?? '';

    this.loginForm.patchValue(
      {
        email,
        password,
      },
      { emitEvent: false },
    );
  }
}
