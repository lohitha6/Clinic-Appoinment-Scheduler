const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3002;
const JWT_SECRET = process.env.JWT_SECRET || 'clinic_secret_key';

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// JWT verification middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, role, password } = req.body;
    
    if (!firstName || !lastName || !email || !role || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if user already exists
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const userResult = await pool.query(
      'INSERT INTO users (email, password_hash, first_name, last_name, phone, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [email, hashedPassword, firstName, lastName, phone || null, role]
    );

    res.status(201).json({ message: 'User registered successfully', userId: userResult.rows[0].id });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    console.log('Login attempt:', req.body);
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }
    
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    console.log('User found:', result.rows.length > 0);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = result.rows[0];
    console.log('Comparing passwords...');
    const isValid = await bcrypt.compare(password, user.password_hash);
    console.log('Password valid:', isValid);
    
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    
    const response = {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role
      },
      token
    };
    
    console.log('Login successful for:', email);
    res.json(response);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// Appointments Routes
app.get('/api/appointments', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.*, 
             u1.first_name as patient_first_name, u1.last_name as patient_last_name,
             u2.first_name as doctor_first_name, u2.last_name as doctor_last_name,
             d.specialization
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN users u1 ON p.user_id = u1.id
      JOIN doctors doc ON a.doctor_id = doc.id
      JOIN users u2 ON doc.user_id = u2.id
      JOIN doctors d ON a.doctor_id = d.id
      ORDER BY a.date_time DESC
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/appointments', verifyToken, async (req, res) => {
  try {
    const { patientId, doctorId, dateTime, type, duration, notes, symptoms } = req.body;
    const result = await pool.query(
      'INSERT INTO appointments (patient_id, doctor_id, date_time, type, duration, notes, symptoms) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [patientId, doctorId, dateTime, type, duration || 30, notes, symptoms]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add Patient
app.post('/api/patients', verifyToken, async (req, res) => {
  try {
    console.log('Received patient data:', req.body);
    const { firstName, lastName, email, phone, dateOfBirth, gender, address, emergencyContact, bloodType, medicalHistory, allergies } = req.body;
    
    if (!firstName || !lastName || !email || !dateOfBirth || !gender) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // First create user
    const hashedPassword = await bcrypt.hash('password123', 10);
    const userResult = await pool.query(
      'INSERT INTO users (email, password_hash, first_name, last_name, phone, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [email, hashedPassword, firstName, lastName, phone || null, 'patient']
    );
    
    // Then create patient record
    const patientResult = await pool.query(
      'INSERT INTO patients (user_id, date_of_birth, gender, address, emergency_contact, medical_history, allergies, blood_type) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [userResult.rows[0].id, dateOfBirth, gender, address || null, emergencyContact || null, medicalHistory || null, allergies || null, bloodType || null]
    );
    
    console.log('Patient created successfully:', patientResult.rows[0]);
    res.status(201).json({ success: true, patient: patientResult.rows[0] });
  } catch (error) {
    console.error('Error creating patient:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// Patients Routes
app.get('/api/patients', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, u.first_name, u.last_name, u.email, u.phone
      FROM patients p
      JOIN users u ON p.user_id = u.id
      ORDER BY u.first_name, u.last_name
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Doctors Routes
app.get('/api/doctors', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT d.*, u.first_name, u.last_name, u.email, u.phone
      FROM doctors d
      JOIN users u ON d.user_id = u.id
      ORDER BY u.first_name, u.last_name
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Dashboard Stats
app.get('/api/dashboard/stats', verifyToken, async (req, res) => {
  try {
    const [patients, doctors, appointments, todayAppointments] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM patients'),
      pool.query('SELECT COUNT(*) FROM doctors'),
      pool.query('SELECT COUNT(*) FROM appointments'),
      pool.query('SELECT COUNT(*) FROM appointments WHERE DATE(date_time) = CURRENT_DATE')
    ]);

    res.json({
      totalPatients: parseInt(patients.rows[0].count),
      totalDoctors: parseInt(doctors.rows[0].count),
      totalAppointments: parseInt(appointments.rows[0].count),
      todayAppointments: parseInt(todayAppointments.rows[0].count)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add Doctor
app.post('/api/doctors', verifyToken, async (req, res) => {
  try {
    console.log('Received doctor data:', req.body);
    const { firstName, lastName, email, phone, specialization, licenseNumber, experience, consultationFee, qualification } = req.body;
    
    if (!firstName || !lastName || !email || !specialization || !licenseNumber) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // First create user
    const hashedPassword = await bcrypt.hash('password123', 10);
    const userResult = await pool.query(
      'INSERT INTO users (email, password_hash, first_name, last_name, phone, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [email, hashedPassword, firstName, lastName, phone || null, 'doctor']
    );
    
    // Then create doctor record
    const doctorResult = await pool.query(
      'INSERT INTO doctors (user_id, specialization, license_number, experience, qualification, consultation_fee) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [userResult.rows[0].id, specialization, licenseNumber, parseInt(experience) || 0, qualification || null, parseFloat(consultationFee) || 0]
    );
    
    console.log('Doctor created successfully:', doctorResult.rows[0]);
    res.status(201).json({ success: true, doctor: doctorResult.rows[0] });
  } catch (error) {
    console.error('Error creating doctor:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// Reports Routes
app.get('/api/reports/patients', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, u.first_name, u.last_name, u.email, u.phone
      FROM patients p
      JOIN users u ON p.user_id = u.id
      ORDER BY u.first_name, u.last_name
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/reports/doctors', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT d.*, u.first_name, u.last_name, u.email, u.phone
      FROM doctors d
      JOIN users u ON d.user_id = u.id
      ORDER BY u.first_name, u.last_name
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/reports/appointments', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.*, 
             u1.first_name as patient_first_name, u1.last_name as patient_last_name,
             u2.first_name as doctor_first_name, u2.last_name as doctor_last_name,
             d.specialization
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN users u1 ON p.user_id = u1.id
      JOIN doctors doc ON a.doctor_id = doc.id
      JOIN users u2 ON doc.user_id = u2.id
      JOIN doctors d ON a.doctor_id = d.id
      ORDER BY a.date_time DESC
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Test database connection on startup
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  } else {
    console.log('✅ Database connected successfully');
  }
});

// Delete endpoints
app.delete('/api/patients/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Delete patient record first
    await pool.query('DELETE FROM patients WHERE id = $1', [id]);
    
    // Get user_id and delete user
    const userResult = await pool.query('SELECT user_id FROM patients WHERE id = $1', [id]);
    if (userResult.rows.length > 0) {
      await pool.query('DELETE FROM users WHERE id = $1', [userResult.rows[0].user_id]);
    }
    
    res.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    console.error('Error deleting patient:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

app.delete('/api/doctors/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Delete doctor record first
    await pool.query('DELETE FROM doctors WHERE id = $1', [id]);
    
    res.json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    console.error('Error deleting doctor:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

app.delete('/api/appointments/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    await pool.query('DELETE FROM appointments WHERE id = $1', [id]);
    
    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});