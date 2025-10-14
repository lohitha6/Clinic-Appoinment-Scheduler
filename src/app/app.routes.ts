import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.dashboardRoutes),
    canActivate: [AuthGuard]
  },
  {
    path: 'appointments',
    loadChildren: () => import('./features/appointments/appointments.routes').then(m => m.appointmentsRoutes),
    canActivate: [AuthGuard]
  },
  {
    path: 'patients',
    loadChildren: () => import('./features/patients/patients.routes').then(m => m.patientsRoutes),
    canActivate: [AuthGuard]
  },
  {
    path: 'doctors',
    loadChildren: () => import('./features/doctors/doctors.routes').then(m => m.doctorsRoutes),
    canActivate: [AuthGuard]
  },
  {
    path: 'reports',
    loadChildren: () => import('./features/reports/reports.routes').then(m => m.reportsRoutes),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: '/auth/login'
  }
];