import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginModalComponent } from '../login-model/login-modal.component';
import { AuthService } from '../../shared/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, LoginModalComponent],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  returnUrl = '/';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
    if (this.authService.isLoggedIn()) {
      const role = this.authService.getRole();
      if (role === 'admin') {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigateByUrl(this.returnUrl);
      }
    }
  }

  onLoggedIn(): void {
    const role = this.authService.getRole();
    if (role === 'admin') {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigateByUrl(this.returnUrl);
    }
  }
}

