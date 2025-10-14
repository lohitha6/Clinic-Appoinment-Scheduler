import { Routes } from '@angular/router';

export const doctorsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./doctors.component').then(m => m.DoctorsComponent)
  },
  {
    path: 'add',
    loadComponent: () => import('./add-doctor.component').then(m => m.AddDoctorComponent)
  }
];