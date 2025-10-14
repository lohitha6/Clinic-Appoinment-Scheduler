import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  template: `
    <div class="appointments-container">
      <div class="header">
        <h1>Appointments</h1>
        <button mat-raised-button color="primary" routerLink="/appointments/add">
          <mat-icon>add</mat-icon>
          New Appointment
        </button>
      </div>

      <mat-card>
        <mat-card-header>
          <mat-card-title>All Appointments</mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>Search appointments...</mat-label>
            <input matInput (keyup)="applyFilter($event)">
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>

          <table mat-table [dataSource]="appointments" class="appointments-table">
            <ng-container matColumnDef="patient">
              <th mat-header-cell *matHeaderCellDef>Patient</th>
              <td mat-cell *matCellDef="let appointment">
                {{appointment.patient_first_name}} {{appointment.patient_last_name}}
              </td>
            </ng-container>

            <ng-container matColumnDef="doctor">
              <th mat-header-cell *matHeaderCellDef>Doctor</th>
              <td mat-cell *matCellDef="let appointment">
                Dr. {{appointment.doctor_first_name}} {{appointment.doctor_last_name}}
                <br><small>{{appointment.specialization}}</small>
              </td>
            </ng-container>

            <ng-container matColumnDef="dateTime">
              <th mat-header-cell *matHeaderCellDef>Date & Time</th>
              <td mat-cell *matCellDef="let appointment">
                {{appointment.date_time | date:'MMM dd, yyyy'}}
                <br>{{appointment.date_time | date:'h:mm a'}}
              </td>
            </ng-container>

            <ng-container matColumnDef="type">
              <th mat-header-cell *matHeaderCellDef>Type</th>
              <td mat-cell *matCellDef="let appointment">
                <mat-chip>{{appointment.type}}</mat-chip>
              </td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let appointment">
                <mat-chip [class]="'status-' + appointment.status">
                  {{appointment.status}}
                </mat-chip>
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let appointment">
                <button mat-icon-button (click)="editAppointment(appointment)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteAppointment(appointment.id)">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .appointments-container {
      padding: 2rem;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .search-field {
      width: 100%;
      max-width: 400px;
      margin-bottom: 1rem;
    }

    .appointments-table {
      width: 100%;
    }

    .status-scheduled { background: #e3f2fd; color: #1976d2; }
    .status-confirmed { background: #e8f5e8; color: #388e3c; }
    .status-completed { background: #f3e5f5; color: #7b1fa2; }
    .status-cancelled { background: #ffebee; color: #d32f2f; }

    mat-chip {
      font-size: 0.75rem;
      text-transform: capitalize;
    }

    @media (max-width: 768px) {
      .header {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
      }
    }
  `]
})
export class AppointmentsComponent implements OnInit {
  appointments: any[] = [];
  displayedColumns = ['patient', 'doctor', 'dateTime', 'type', 'status', 'actions'];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.http.get<any[]>('http://localhost:3002/api/appointments')
      .subscribe(appointments => this.appointments = appointments);
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    // Implement filtering logic
  }

  editAppointment(appointment: any): void {
    console.log('Edit appointment:', appointment);
  }

  deleteAppointment(appointmentId: string): void {
    if (confirm('Are you sure you want to delete this appointment?')) {
      this.http.delete(`http://localhost:3002/api/appointments/${appointmentId}`)
        .subscribe({
          next: () => {
            this.loadAppointments();
          },
          error: (error) => {
            alert('Error deleting appointment: ' + (error.error?.message || 'Server error'));
          }
        });
    }
  }
}