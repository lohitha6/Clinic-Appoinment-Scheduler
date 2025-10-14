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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-add-patient',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Add New Patient</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="patientForm" (ngSubmit)="onSubmit()">
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
                <mat-label>Date of Birth</mat-label>
                <input matInput [matDatepicker]="picker" formControlName="dateOfBirth" required>
                <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                <mat-datepicker #picker></mat-datepicker>
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Gender</mat-label>
                <mat-select formControlName="gender" required>
                  <mat-option value="male">Male</mat-option>
                  <mat-option value="female">Female</mat-option>
                  <mat-option value="other">Other</mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Address</mat-label>
              <textarea matInput formControlName="address" rows="3"></textarea>
            </mat-form-field>

            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Emergency Contact</mat-label>
                <input matInput formControlName="emergencyContact">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Blood Type</mat-label>
                <input matInput formControlName="bloodType">
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Medical History</mat-label>
              <textarea matInput formControlName="medicalHistory" rows="3"></textarea>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Allergies</mat-label>
              <textarea matInput formControlName="allergies" rows="2"></textarea>
            </mat-form-field>

            <div class="form-actions">
              <button mat-button type="button" (click)="goBack()">Cancel</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="patientForm.invalid || loading">
                {{loading ? 'Saving...' : 'Save Patient'}}
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
export class AddPatientComponent {
  patientForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.patientForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required],
      address: [''],
      emergencyContact: [''],
      bloodType: [''],
      medicalHistory: [''],
      allergies: ['']
    });
  }

  onSubmit(): void {
    if (this.patientForm.valid) {
      this.loading = true;
      console.log('Submitting patient data:', this.patientForm.value);
      this.http.post('http://localhost:3002/api/patients', this.patientForm.value)
        .subscribe({
          next: (response) => {
            console.log('Patient created successfully:', response);
            this.router.navigate(['/patients']);
          },
          error: (error) => {
            console.error('Error creating patient:', error);
            alert('Error saving patient: ' + (error.error?.message || 'Server error'));
            this.loading = false;
          }
        });
    } else {
      console.log('Form is invalid:', this.patientForm.errors);
      alert('Please fill all required fields');
    }
  }

  goBack(): void {
    this.router.navigate(['/patients']);
  }
}