import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';

interface DashboardStats {
  totalPatients: number;
  totalDoctors: number;
  totalAppointments: number;
  todayAppointments: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatGridListModule
  ],
  template: `
    <div class="dashboard-container">
      <h1>Dashboard</h1>
      
      <mat-grid-list cols="4" rowHeight="200px" gutterSize="16px" class="stats-grid">
        <mat-grid-tile>
          <mat-card class="stat-card patients">
            <mat-card-content>
              <div class="stat-icon">
                <mat-icon>people</mat-icon>
              </div>
              <div class="stat-info">
                <h2>{{stats?.totalPatients || 0}}</h2>
                <p>Total Patients</p>
              </div>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>

        <mat-grid-tile>
          <mat-card class="stat-card doctors">
            <mat-card-content>
              <div class="stat-icon">
                <mat-icon>local_hospital</mat-icon>
              </div>
              <div class="stat-info">
                <h2>{{stats?.totalDoctors || 0}}</h2>
                <p>Total Doctors</p>
              </div>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>

        <mat-grid-tile>
          <mat-card class="stat-card appointments">
            <mat-card-content>
              <div class="stat-icon">
                <mat-icon>event</mat-icon>
              </div>
              <div class="stat-info">
                <h2>{{stats?.totalAppointments || 0}}</h2>
                <p>Total Appointments</p>
              </div>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>

        <mat-grid-tile>
          <mat-card class="stat-card today">
            <mat-card-content>
              <div class="stat-icon">
                <mat-icon>today</mat-icon>
              </div>
              <div class="stat-info">
                <h2>{{stats?.todayAppointments || 0}}</h2>
                <p>Today's Appointments</p>
              </div>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>
      </mat-grid-list>

      <div class="quick-actions">
        <h2>Quick Actions</h2>
        <div class="action-buttons">
          <button mat-raised-button color="primary" routerLink="/appointments/new">
            <mat-icon>add</mat-icon>
            New Appointment
          </button>
          <button mat-raised-button color="accent" routerLink="/patients/new">
            <mat-icon>person_add</mat-icon>
            Add Patient
          </button>
          <button mat-raised-button routerLink="/appointments">
            <mat-icon>view_list</mat-icon>
            View All Appointments
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 2rem;
    }

    .stats-grid {
      margin: 2rem 0;
    }

    .stat-card {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stat-card mat-card-content {
      display: flex;
      align-items: center;
      gap: 1rem;
      width: 100%;
    }

    .stat-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      color: white;
    }

    .patients .stat-icon { background: #3b82f6; }
    .doctors .stat-icon { background: #059669; }
    .appointments .stat-icon { background: #d97706; }
    .today .stat-icon { background: #dc2626; }

    .stat-info h2 {
      margin: 0;
      font-size: 2rem;
      font-weight: 600;
    }

    .stat-info p {
      margin: 0;
      color: #6b7280;
      font-size: 0.875rem;
    }

    .quick-actions {
      margin-top: 3rem;
    }

    .action-buttons {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      margin-top: 1rem;
    }

    .action-buttons button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr) !important;
      }
    }

    @media (max-width: 480px) {
      .stats-grid {
        grid-template-columns: 1fr !important;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadStats();
  }

  private loadStats(): void {
    this.http.get<DashboardStats>('http://localhost:3002/api/dashboard/stats')
      .subscribe(stats => this.stats = stats);
  }
}