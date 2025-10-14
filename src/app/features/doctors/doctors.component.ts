import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-doctors',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  template: `
    <div class="container">
      <div class="header">
        <h1>Doctors Management</h1>
        <button mat-raised-button color="primary" routerLink="/doctors/add">
          <mat-icon>add</mat-icon>
          Add Doctor
        </button>
      </div>

      <mat-card>
        <mat-card-content>
          <table mat-table [dataSource]="doctors" class="doctors-table">
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Name</th>
              <td mat-cell *matCellDef="let doctor">
                Dr. {{doctor.first_name}} {{doctor.last_name}}
              </td>
            </ng-container>

            <ng-container matColumnDef="specialization">
              <th mat-header-cell *matHeaderCellDef>Specialization</th>
              <td mat-cell *matCellDef="let doctor">
                <mat-chip>{{doctor.specialization}}</mat-chip>
              </td>
            </ng-container>

            <ng-container matColumnDef="license">
              <th mat-header-cell *matHeaderCellDef>License</th>
              <td mat-cell *matCellDef="let doctor">{{doctor.license_number}}</td>
            </ng-container>

            <ng-container matColumnDef="experience">
              <th mat-header-cell *matHeaderCellDef>Experience</th>
              <td mat-cell *matCellDef="let doctor">{{doctor.experience}} years</td>
            </ng-container>

            <ng-container matColumnDef="fee">
              <th mat-header-cell *matHeaderCellDef>Fee</th>
              <td mat-cell *matCellDef="let doctor">{{doctor.consultation_fee | currency}}</td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let doctor">
                <button mat-icon-button (click)="editDoctor(doctor)"><mat-icon>edit</mat-icon></button>
                <button mat-icon-button color="warn" (click)="deleteDoctor(doctor.id)"><mat-icon>delete</mat-icon></button>
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
    .container { padding: 2rem; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .doctors-table { width: 100%; }
  `]
})
export class DoctorsComponent implements OnInit {
  doctors: any[] = [];
  displayedColumns = ['name', 'specialization', 'license', 'experience', 'fee', 'actions'];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors(): void {
    this.http.get<any[]>('http://localhost:3002/api/doctors')
      .subscribe(doctors => this.doctors = doctors);
  }

  editDoctor(doctor: any): void {
    console.log('Edit doctor:', doctor);
  }

  deleteDoctor(doctorId: string): void {
    if (confirm('Are you sure you want to delete this doctor?')) {
      this.http.delete(`http://localhost:3002/api/doctors/${doctorId}`)
        .subscribe({
          next: () => {
            this.loadDoctors();
          },
          error: (error) => {
            alert('Error deleting doctor: ' + (error.error?.message || 'Server error'));
          }
        });
    }
  }
}