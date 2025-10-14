export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  dateTime: Date;
  duration: number; // in minutes
  status: AppointmentStatus;
  type: AppointmentType;
  notes?: string;
  symptoms?: string;
  diagnosis?: string;
  prescription?: string;
  createdAt: Date;
  updatedAt: Date;
  patient?: Patient;
  doctor?: Doctor;
}

export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show'
}

export enum AppointmentType {
  CONSULTATION = 'consultation',
  FOLLOW_UP = 'follow_up',
  EMERGENCY = 'emergency',
  ROUTINE_CHECKUP = 'routine_checkup',
  VACCINATION = 'vaccination'
}

export interface Patient {
  id: string;
  userId: string;
  dateOfBirth: Date;
  gender: Gender;
  address: string;
  emergencyContact: string;
  medicalHistory?: string;
  allergies?: string;
  bloodType?: string;
  user?: User;
}

export interface Doctor {
  id: string;
  userId: string;
  specialization: string;
  licenseNumber: string;
  experience: number;
  qualification: string;
  consultationFee: number;
  availability: DoctorAvailability[];
  user?: User;
}

export interface DoctorAvailability {
  id: string;
  doctorId: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  isActive: boolean;
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other'
}

export interface CreateAppointmentRequest {
  patientId: string;
  doctorId: string;
  dateTime: Date;
  type: AppointmentType;
  notes?: string;
  symptoms?: string;
}