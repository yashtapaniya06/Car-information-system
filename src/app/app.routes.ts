import { Routes } from '@angular/router';
import { AuthGuard } from './shared/auth.guard';
import { UserAuthGuard } from './shared/user-auth.guard';

export const routes: Routes = [
  // 🌍 Public Routes
  {
    path: '',
    loadComponent: () => import('./components/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'home',
    loadComponent: () => import('./components/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login-page/login-page.component').then((m) => m.LoginPageComponent),
  },
  {
    path: 'cars',
    canActivate: [UserAuthGuard],
    loadComponent: () => import('./components/cars/cars.component').then((m) => m.CarsComponent),
  },
  {
    path: 'car/:id',
    canActivate: [UserAuthGuard],
    loadComponent: () =>
      import('./components/car-info/car-info.component').then((m) => m.CarInfoComponent),
  },
  {
    path: 'about',
    loadComponent: () => import('./components/about/about.component').then((m) => m.AboutComponent),
  },
  {
    path: 'contact',
    canActivate: [UserAuthGuard],
    loadComponent: () =>
      import('./components/contact/contact.component').then((m) => m.ContactComponent),
  },

  // 🔒 Admin Protected Routes
  {
    path: 'admin',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./admin/layout/admin-layout.component').then((m) => m.AdminLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./admin/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'add-car',
        loadComponent: () =>
          import('./admin/add-car/add-car.component').then((m) => m.AddCarComponent),
      },
      {
        path: 'users',
        loadComponent: () => import('./admin/user/user.component').then((m) => m.UserComponent),
      },
      {
        path: 'car-manage',
        loadComponent: () =>
          import('./admin/carManage/car-manage.component').then((m) => m.CarManageComponent),
      },
      {
        path: 'update-car/:id',
        loadComponent: () =>
          import('./admin/updatecar/update-car.component').then((m) => m.UpdateCarComponent),
      },
      {
        path: 'ratings',
        loadComponent: () =>
          import('./admin/carRatingAnalysis/car-rating-analysis.component').then(
            (m) => m.CarRatingAnalysisComponent,
          ),
      },
    ],
  },
  {
    path: 'signUp',
    loadComponent: () =>
      import('./components/register/register.component').then((m) => m.SignUpComponent),
  },

  // ❌ Fallback
  { path: '**', redirectTo: '' },
];
