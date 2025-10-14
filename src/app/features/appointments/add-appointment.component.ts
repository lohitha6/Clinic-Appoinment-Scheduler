import { Component, OnInit } from '@angular/core';
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
  selector: 'app-add-appointment',
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
          <mat-card-title>Schedule New Appointment</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="appointmentForm" (ngSubmit)="onSubmit()">
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Patient</mat-label>
                <mat-select formControlName="patientId" required>
                  <mat-option *ngFor="let patient of patients" [value]="patient.id">
                    {{patient.first_name}} {{patient.last_name}}
                  </mat-option>
                </mat-select>
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Doctor</mat-label>
                <mat-select formControlName="doctorId" required>
                  <mat-option *ngFor="let doctor of doctors" [value]="doctor.id">
                    Dr. {{doctor.first_name}} {{doctor.last_name}} - {{doctor.specialization}}
                  </mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Date</mat-label>
                <input matInput [matDatepicker]="picker" formControlName="date" required>
                <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                <mat-datepicker #picker></mat-datepicker>
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Time</mat-label>
                <input matInput type="time" formControlName="time" required>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Type</mat-label>
                <mat-select formControlName="type" required>
                  <mat-option value="consultation">Consultation</mat-option>
                  <mat-option value="follow_up">Follow Up</mat-option>
                  <mat-option value="emergency">Emergency</mat-option>
                  <mat-option value="routine_checkup">Routine Checkup</mat-option>
                  <mat-option value="vaccination">Vaccination</mat-option>
                </mat-select>
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Duration (minutes)</mat-label>
                <input matInput type="number" formControlName="duration" value="30">
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Notes</mat-label>
              <textarea matInput formControlName="notes" rows="3"></textarea>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Symptoms</mat-label>
              <textarea matInput formControlName="symptoms" rows="3"></textarea>
            </mat-form-field>

            <div class="form-actions">
              <button mat-button type="button" (click)="goBack()">Cancel</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="appointmentForm.invalid || loading">
                {{loading ? 'Scheduling...' : 'Schedule Appointment'}}
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
export class AddAppointmentComponent implements OnInit {
  appointmentForm: FormGroup;
  loading = false;
  patients: any[] = [];
  doctors: any[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.appointmentForm = this.fb.group({
      patientId: ['', Validators.required],
      doctorId: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      type: ['', Validators.required],
      duration: [30],
      notes: [''],
      symptoms: ['']
    });
  }

  ngOnInit(): void {
    this.loadPatients();
    this.loadDoctors();
  }

  loadPatients(): void {
    this.http.get<any[]>('http://localhost:3002/api/patients')
      .subscribe(patients => this.patients = patients);
  }

  loadDoctors(): void {
    this.http.get<any[]>('http://localhost:3002/api/doctors')
      .subscribe(doctors => this.doctors = doctors);
  }

  onSubmit(): void {
    if (this.appointmentForm.valid) {
      this.loading = true;
      const formValue = this.appointmentForm.value;
      const dateTime = new Date(formValue.date);
      const [hours, minutes] = formValue.time.split(':');
      dateTime.setHours(parseInt(hours), parseInt(minutes));

      const appointmentData = {
        patientId: formValue.patientId,
        doctorId: formValue.doctorId,
        dateTime: dateTime.toISOString(),
        type: formValue.type,
        duration: formValue.duration,
        notes: formValue.notes,
        symptoms: formValue.symptoms
      };

      console.log('Submitting appointment data:', appointmentData);
      this.http.post('http://localhost:3002/api/appointments', appointmentData)
        .subscribe({
          next: (response) => {
            console.log('Appointment created successfully:', response);
            this.router.navigate(['/appointments']);
          },
          error: (error) => {
            console.error('Error creating appointment:', error);
            alert('Error saving appointment: ' + (error.error?.message || 'Server error'));
            this.loading = false;
          }
        });
    } else {
      console.log('Form is invalid:', this.appointmentForm.errors);
      alert('Please fill all required fields');
    }
  }

  goBack(): void {
    this.router.navigate(['/appointments']);
  }
}