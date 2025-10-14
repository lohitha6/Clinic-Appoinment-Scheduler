const { Client } = require('pg');
const fs = require('fs');
const bcrypt = require('bcryptjs');

async function setupDatabase() {
  // First connect to postgres database to create clinic database
  const adminClient = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'admin',
    port: 5432,
  });

  try {
    await adminClient.connect();
    console.log('Connected to PostgreSQL');

    // Create clinic database if it doesn't exist
    try {
      await adminClient.query('CREATE DATABASE clinic');
      console.log('✅ Database "clinic" created successfully');
    } catch (error) {
      if (error.code === '42P04') {
        console.log('ℹ️  Database "clinic" already exists');
      } else {
        throw error;
      }
    }

    await adminClient.end();

    // Now connect to clinic database and run schema
    const clinicClient = new Client({
      user: 'postgres',
      host: 'localhost',
      database: 'clinic',
      password: 'admin',
      port: 5432,
    });

    await clinicClient.connect();
    console.log('Connected to clinic database');

    // Read and execute schema
    const schema = fs.readFileSync('./backend/schema.sql', 'utf8');
    
    // Split schema into individual statements and execute
    const statements = schema.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await clinicClient.query(statement);
        } catch (error) {
          if (!error.message.includes('already exists')) {
            console.log('Error executing:', statement.substring(0, 50) + '...');
            console.log('Error:', error.message);
          }
        }
      }
    }

    // Insert sample data with hashed passwords
    const hashedPassword = await bcrypt.hash('password', 10);
    
    // Clear existing sample data and insert new
    await clinicClient.query('DELETE FROM users WHERE email IN ($1, $2, $3)', 
      ['admin@clinic.com', 'dr.smith@clinic.com', 'patient@example.com']);

    // Insert users one by one to ensure proper hashing
    await clinicClient.query(
      'INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (email) DO NOTHING',
      ['admin@clinic.com', hashedPassword, 'Admin', 'User', 'admin']
    );
    
    await clinicClient.query(
      'INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (email) DO NOTHING',
      ['dr.smith@clinic.com', hashedPassword, 'John', 'Smith', 'doctor']
    );
    
    await clinicClient.query(
      'INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (email) DO NOTHING',
      ['patient@example.com', hashedPassword, 'Jane', 'Doe', 'patient']
    );

    // Add sample doctor and patient records
    const adminUser = await clinicClient.query('SELECT id FROM users WHERE email = $1', ['dr.smith@clinic.com']);
    const patientUser = await clinicClient.query('SELECT id FROM users WHERE email = $1', ['patient@example.com']);

    if (adminUser.rows.length > 0) {
      await clinicClient.query(`
        INSERT INTO doctors (user_id, specialization, license_number, experience, qualification, consultation_fee) 
        VALUES ($1, 'General Medicine', 'DOC001', 5, 'MBBS, MD', 100.00)
        ON CONFLICT DO NOTHING
      `, [adminUser.rows[0].id]);
    }

    if (patientUser.rows.length > 0) {
      await clinicClient.query(`
        INSERT INTO patients (user_id, date_of_birth, gender, address, emergency_contact) 
        VALUES ($1, '1990-01-01', 'female', '123 Main St', '+1234567890')
        ON CONFLICT DO NOTHING
      `, [patientUser.rows[0].id]);
    }

    await clinicClient.end();
    console.log('✅ Database setup completed successfully!');
    console.log('\n🔑 Login Credentials:');
    console.log('Admin: admin@clinic.com / password');
    console.log('Doctor: dr.smith@clinic.com / password');
    console.log('Patient: patient@example.com / password');

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  }
}

setupDatabase();