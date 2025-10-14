import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-add-doctor',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Add New Doctor</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="doctorForm" (ngSubmit)="onSubmit()">
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>First Name</mat-label>
                <input matInput formControlName="firstName" required>
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Last Name</mat-label>
                <input matInput formControlName="lastName" required>
              </mat-form-field>
            </div>
            
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Email</mat-label>
                <input matInput type="email" formControlName="email" required>
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Phone</mat-label>
                <input matInput formControlName="phone">
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Specialization</mat-label>
                <mat-select formControlName="specialization" required>
                  <mat-option value="General Medicine">General Medicine</mat-option>
                  <mat-option value="Cardiology">Cardiology</mat-option>
                  <mat-option value="Dermatology">Dermatology</mat-option>
                  <mat-option value="Pediatrics">Pediatrics</mat-option>
                  <mat-option value="Orthopedics">Orthopedics</mat-option>
                  <mat-option value="Neurology">Neurology</mat-option>
                  <mat-option value="Psychiatry">Psychiatry</mat-option>
                </mat-select>
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>License Number</mat-label>
                <input matInput formControlName="licenseNumber" required>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Experience (years)</mat-label>
                <input matInput type="number" formControlName="experience" required>
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Consultation Fee ($)</mat-label>
                <input matInput type="number" formControlName="consultationFee" required>
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Qualification</mat-label>
              <textarea matInput formControlName="qualification" rows="3" placeholder="e.g., MBBS, MD, PhD"></textarea>
            </mat-form-field>

            <div class="form-actions">
              <button mat-button type="button" (click)="goBack()">Cancel</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="doctorForm.invalid || loading">
                {{loading ? 'Saving...' : 'Save Doctor'}}
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container { padding: 2rem; max-width: 800px; margin: 0 auto; }
    .form-row { display: flex; gap: 1rem; }
    .form-row mat-form-field { flex: 1; }
    .full-width { width: 100%; }
    mat-form-field { margin-bottom: 1rem; }
    .form-actions { display: flex; gap: 1rem; justify-content: flex-end; margin-top: 2rem; }
  `]
})
export class AddDoctorComponent {
  doctorForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.doctorForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      specialization: ['', Validators.required],
      licenseNumber: ['', Validators.required],
      experience: ['', [Validators.required, Validators.min(0)]],
      consultationFee: ['', [Validators.required, Validators.min(0)]],
      qualification: ['']
    });
  }

  onSubmit(): void {
    if (this.doctorForm.valid) {
      this.loading = true;
      console.log('Submitting doctor data:', this.doctorForm.value);
      this.http.post('http://localhost:3002/api/doctors', this.doctorForm.value)
        .subscribe({
          next: (response) => {
            console.log('Doctor created successfully:', response);
            this.router.navigate(['/doctors']);
          },
          error: (error) => {
            console.error('Error creating doctor:', error);
            alert('Error saving doctor: ' + (error.error?.message || 'Server error'));
            this.loading = false;
          }
        });
    } else {
      console.log('Form is invalid:', this.doctorForm.errors);
      alert('Please fill all required fields');
    }
  }

  goBack(): void {
    this.router.navigate(['/doctors']);
  }
}