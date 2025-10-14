import { Routes } from '@angular/router';

export const patientsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./patients.component').then(m => m.PatientsComponent)
  },
  {
    path: 'add',
    loadComponent: () => import('./add-patient.component').then(m => m.AddPatientComponent)
  }
];