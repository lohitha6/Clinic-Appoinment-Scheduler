import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="container">
      <div class="header">
        <h1>Patients Management</h1>
        <button mat-raised-button color="primary" routerLink="/patients/add">
          <mat-icon>add</mat-icon>
          Add Patient
        </button>
      </div>

      <mat-card>
        <mat-card-content>
          <table mat-table [dataSource]="patients" class="patients-table">
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Name</th>
              <td mat-cell *matCellDef="let patient">
                {{patient.first_name}} {{patient.last_name}}
              </td>
            </ng-container>

            <ng-container matColumnDef="email">
              <th mat-header-cell *matHeaderCellDef>Email</th>
              <td mat-cell *matCellDef="let patient">{{patient.email}}</td>
            </ng-container>

            <ng-container matColumnDef="phone">
              <th mat-header-cell *matHeaderCellDef>Phone</th>
              <td mat-cell *matCellDef="let patient">{{patient.phone}}</td>
            </ng-container>

            <ng-container matColumnDef="gender">
              <th mat-header-cell *matHeaderCellDef>Gender</th>
              <td mat-cell *matCellDef="let patient">{{patient.gender}}</td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let patient">
                <button mat-icon-button (click)="editPatient(patient)"><mat-icon>edit</mat-icon></button>
                <button mat-icon-button color="warn" (click)="deletePatient(patient.id)"><mat-icon>delete</mat-icon></button>
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
    .patients-table { width: 100%; }
  `]
})
export class PatientsComponent implements OnInit {
  patients: any[] = [];
  displayedColumns = ['name', 'email', 'phone', 'gender', 'actions'];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.http.get<any[]>('http://localhost:3002/api/patients')
      .subscribe(patients => this.patients = patients);
  }

  editPatient(patient: any): void {
    // Navigate to edit page with patient ID
    console.log('Edit patient:', patient);
  }

  deletePatient(patientId: string): void {
    if (confirm('Are you sure you want to delete this patient?')) {
      this.http.delete(`http://localhost:3002/api/patients/${patientId}`)
        .subscribe({
          next: () => {
            this.loadPatients(); // Refresh list
          },
          error: (error) => {
            alert('Error deleting patient: ' + (error.error?.message || 'Server error'));
          }
        });
    }
  }
}