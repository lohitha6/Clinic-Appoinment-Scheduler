import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatGridListModule,
    MatTableModule
  ],
  template: `
    <div class="container">
      <h1>Reports & Analytics</h1>
      
      <mat-grid-list cols="3" rowHeight="200px" gutterSize="16px" class="stats-grid">
        <mat-grid-tile>
          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-header">
                <mat-icon>people</mat-icon>
                <h3>Patient Statistics</h3>
              </div>
              <div class="stat-value">{{reports?.totalPatients || 0}}</div>
              <div class="stat-label">Total Patients</div>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>

        <mat-grid-tile>
          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-header">
                <mat-icon>local_hospital</mat-icon>
                <h3>Doctor Statistics</h3>
              </div>
              <div class="stat-value">{{reports?.totalDoctors || 0}}</div>
              <div class="stat-label">Total Doctors</div>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>

        <mat-grid-tile>
          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-header">
                <mat-icon>event</mat-icon>
                <h3>Appointment Statistics</h3>
              </div>
              <div class="stat-value">{{reports?.totalAppointments || 0}}</div>
              <div class="stat-label">Total Appointments</div>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>
      </mat-grid-list>

      <div class="reports-section">
        <mat-card>
          <mat-card-header>
            <mat-card-title>Recent Appointments</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <table mat-table [dataSource]="recentAppointments" class="appointments-table">
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
                </td>
              </ng-container>

              <ng-container matColumnDef="date">
                <th mat-header-cell *matHeaderCellDef>Date</th>
                <td mat-cell *matCellDef="let appointment">
                  {{appointment.date_time | date:'MMM dd, yyyy h:mm a'}}
                </td>
              </ng-container>

              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Status</th>
                <td mat-cell *matCellDef="let appointment">
                  <span class="status-badge" [class]="'status-' + appointment.status">
                    {{appointment.status}}
                  </span>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="export-section">
        <h2>Export Reports</h2>
        <div class="export-buttons">
          <button mat-raised-button color="primary" (click)="exportPatients()">
            <mat-icon>download</mat-icon>
            Export Patients
          </button>
          <button mat-raised-button color="accent" (click)="exportAppointments()">
            <mat-icon>download</mat-icon>
            Export Appointments
          </button>
          <button mat-raised-button (click)="exportDoctors()">
            <mat-icon>download</mat-icon>
            Export Doctors
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container { padding: 2rem; }
    .stats-grid { margin: 2rem 0; }
    .stat-card { width: 100%; height: 100%; }
    .stat-header { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; }
    .stat-header mat-icon { color: #3b82f6; }
    .stat-value { font-size: 2rem; font-weight: 600; color: #1f2937; }
    .stat-label { color: #6b7280; font-size: 0.875rem; }
    .reports-section { margin: 2rem 0; }
    .appointments-table { width: 100%; }
    .status-badge { padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem; }
    .status-scheduled { background: #e3f2fd; color: #1976d2; }
    .status-confirmed { background: #e8f5e8; color: #388e3c; }
    .status-completed { background: #f3e5f5; color: #7b1fa2; }
    .export-section { margin: 2rem 0; }
    .export-buttons { display: flex; gap: 1rem; flex-wrap: wrap; margin-top: 1rem; }
  `]
})
export class ReportsComponent implements OnInit {
  reports: any = null;
  recentAppointments: any[] = [];
  displayedColumns = ['patient', 'doctor', 'date', 'status'];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadReports();
    this.loadRecentAppointments();
  }

  loadReports(): void {
    this.http.get('http://localhost:3002/api/dashboard/stats')
      .subscribe(reports => this.reports = reports);
  }

  loadRecentAppointments(): void {
    this.http.get<any[]>('http://localhost:3002/api/appointments?limit=10')
      .subscribe(appointments => this.recentAppointments = appointments.slice(0, 10));
  }

  exportPatients(): void {
    this.http.get('http://localhost:3002/api/reports/patients')
      .subscribe(data => this.downloadFile(data, 'patients.json'));
  }

  exportAppointments(): void {
    this.http.get('http://localhost:3002/api/reports/appointments')
      .subscribe(data => this.downloadFile(data, 'appointments.json'));
  }

  exportDoctors(): void {
    this.http.get('http://localhost:3002/api/reports/doctors')
      .subscribe(data => this.downloadFile(data, 'doctors.json'));
  }

  private downloadFile(data: any, filename: string): void {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}