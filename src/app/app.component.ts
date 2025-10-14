import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatListModule
  ],
  template: `
    <div class="app-container" *ngIf="authService.isAuthenticated(); else loginTemplate">
      <mat-toolbar color="primary" class="app-toolbar">
        <button mat-icon-button (click)="toggleSidenav()" aria-label="Menu">
          <mat-icon>menu</mat-icon>
        </button>
        <span class="app-title">HealthCare Clinic</span>
        <span class="spacer"></span>
        <button mat-icon-button aria-label="Notifications">
          <mat-icon>notifications</mat-icon>
        </button>
        <button mat-icon-button (click)="logout()" aria-label="Logout">
          <mat-icon>logout</mat-icon>
        </button>
      </mat-toolbar>

      <mat-sidenav-container class="sidenav-container">
        <mat-sidenav #sidenav mode="side" opened class="sidenav">
          <mat-nav-list>
            <a mat-list-item routerLink="/dashboard">
              <mat-icon matListItemIcon>dashboard</mat-icon>
              <span matListItemTitle>Dashboard</span>
            </a>
            <a mat-list-item routerLink="/appointments">
              <mat-icon matListItemIcon>event</mat-icon>
              <span matListItemTitle>Appointments</span>
            </a>
            <a mat-list-item routerLink="/patients">
              <mat-icon matListItemIcon>people</mat-icon>
              <span matListItemTitle>Patients</span>
            </a>
            <a mat-list-item routerLink="/doctors">
              <mat-icon matListItemIcon>local_hospital</mat-icon>
              <span matListItemTitle>Doctors</span>
            </a>
            <a mat-list-item routerLink="/reports">
              <mat-icon matListItemIcon>assessment</mat-icon>
              <span matListItemTitle>Reports</span>
            </a>
          </mat-nav-list>
        </mat-sidenav>

        <mat-sidenav-content class="main-content">
          <router-outlet></router-outlet>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>

    <ng-template #loginTemplate>
      <router-outlet></router-outlet>
    </ng-template>
  `,
  styles: [`
    .app-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .app-toolbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .app-title {
      font-weight: 600;
      font-size: 1.25rem;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .sidenav-container {
      flex: 1;
      margin-top: 64px;
    }

    .sidenav {
      width: 250px;
      background: #ffffff;
      border-right: 1px solid #e5e7eb;
    }

    .main-content {
      padding: 2rem;
      background: #f8fafc;
      min-height: calc(100vh - 64px);
    }

    @media (max-width: 768px) {
      .sidenav {
        width: 200px;
      }
      
      .main-content {
        padding: 1rem;
      }
    }
  `]
})
export class AppComponent {
  title = 'HealthCare Clinic Scheduler';

  constructor(public authService: AuthService) {}

  toggleSidenav() {
    // Implementation for mobile sidenav toggle
  }

  logout() {
    this.authService.logout();
  }
}