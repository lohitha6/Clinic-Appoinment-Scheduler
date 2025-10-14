import { Routes } from '@angular/router';
import { AppointmentsComponent } from './appointments.component';

export const appointmentsRoutes: Routes = [
  {
    path: '',
    component: AppointmentsComponent
  },
  {
    path: 'add',
    loadComponent: () => import('./add-appointment.component').then(m => m.AddAppointmentComponent)
  }
];