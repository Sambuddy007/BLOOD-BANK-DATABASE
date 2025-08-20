const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());
app.use(cors());

// Create/connect to SQLite database
const dbPath = path.join(__dirname, 'bloodbank.db');
const db = new sqlite3.Database(dbPath);

// Initialize database with tables
db.serialize(() => {
  // Create tables if they don't exist
  db.run(`CREATE TABLE IF NOT EXISTS Users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL,
    phone TEXT,
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    last_login TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Donors (
    donor_id INTEGER PRIMARY KEY AUTOINCREMENT,
    donor_code TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    date_of_birth TEXT NOT NULL,
    age INTEGER,
    gender TEXT NOT NULL,
    blood_type TEXT NOT NULL,
    rh_factor TEXT NOT NULL,
    weight REAL,
    height REAL,
    phone TEXT,
    email TEXT,
    address TEXT,
    emergency_contact TEXT,
    emergency_phone TEXT,
    medical_history TEXT,
    medications TEXT,
    allergies TEXT,
    last_donation_date TEXT,
    next_eligible_date TEXT,
    total_donations INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active',
    deferral_reason TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Recipients (
    recipient_id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id TEXT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    date_of_birth TEXT,
    age INTEGER,
    gender TEXT,
    blood_type TEXT NOT NULL,
    rh_factor TEXT NOT NULL,
    weight REAL,
    diagnosis TEXT,
    hospital_id INTEGER,
    doctor_name TEXT,
    urgency_level TEXT DEFAULT 'routine',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Hospitals (
    hospital_id INTEGER PRIMARY KEY AUTOINCREMENT,
    hospital_name TEXT NOT NULL,
    hospital_code TEXT UNIQUE,
    address TEXT,
    city TEXT,
    state TEXT,
    country TEXT,
    phone TEXT,
    email TEXT,
    contact_person TEXT,
    license_number TEXT,
    accreditation_status TEXT DEFAULT 'pending',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS BloodInventory (
    inventory_id INTEGER PRIMARY KEY AUTOINCREMENT,
    donor_id INTEGER,
    blood_type TEXT NOT NULL,
    rh_factor TEXT NOT NULL,
    units_available INTEGER NOT NULL,
    units_reserved INTEGER DEFAULT 0,
    units_expired INTEGER DEFAULT 0,
    collection_date TEXT NOT NULL,
    expiry_date TEXT NOT NULL,
    storage_location TEXT,
    storage_temperature REAL,
    status TEXT DEFAULT 'available',
    notes TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS DonationSessions (
    session_id INTEGER PRIMARY KEY AUTOINCREMENT,
    donor_id INTEGER NOT NULL,
    session_date TEXT NOT NULL,
    start_time TEXT,
    end_time TEXT,
    blood_volume_ml INTEGER,
    hemoglobin_level REAL,
    blood_pressure_systolic INTEGER,
    blood_pressure_diastolic INTEGER,
    pulse_rate INTEGER,
    temperature REAL,
    staff_id INTEGER,
    location TEXT,
    session_notes TEXT,
    status TEXT DEFAULT 'scheduled',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS BloodRequests (
    request_id INTEGER PRIMARY KEY AUTOINCREMENT,
    hospital_id INTEGER NOT NULL,
    requesting_doctor TEXT,
    patient_name TEXT,
    blood_type TEXT NOT NULL,
    rh_factor TEXT NOT NULL,
    units_requested INTEGER NOT NULL,
    urgency_level TEXT DEFAULT 'routine',
    request_date TEXT NOT NULL,
    required_date TEXT NOT NULL,
    diagnosis TEXT,
    special_requirements TEXT,
    status TEXT DEFAULT 'pending',
    approved_by INTEGER,
    approved_at TEXT,
    fulfillment_notes TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS BloodTransfusions (
    transfusion_id INTEGER PRIMARY KEY AUTOINCREMENT,
    request_id INTEGER,
    recipient_id INTEGER,
    inventory_id INTEGER,
    transfusion_date TEXT NOT NULL,
    units_transfused INTEGER NOT NULL,
    staff_id INTEGER,
    transfusion_notes TEXT,
    complications TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS BloodCompatibility (
    compatibility_id INTEGER PRIMARY KEY AUTOINCREMENT,
    donor_blood_type TEXT NOT NULL,
    donor_rh_factor TEXT NOT NULL,
    recipient_blood_type TEXT NOT NULL,
    recipient_rh_factor TEXT NOT NULL,
    is_compatible INTEGER NOT NULL,
    compatibility_notes TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS BloodDrives (
    drive_id INTEGER PRIMARY KEY AUTOINCREMENT,
    drive_name TEXT NOT NULL,
    drive_date TEXT NOT NULL,
    start_time TEXT,
    end_time TEXT,
    location TEXT,
    organizer TEXT,
    target_donors INTEGER,
    actual_donors INTEGER DEFAULT 0,
    status TEXT DEFAULT 'planned',
    notes TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS HealthScreening (
    screening_id INTEGER PRIMARY KEY AUTOINCREMENT,
    donor_id INTEGER NOT NULL,
    session_id INTEGER,
    screening_date TEXT NOT NULL,
    hemoglobin_level REAL,
    blood_pressure_systolic INTEGER,
    blood_pressure_diastolic INTEGER,
    pulse_rate INTEGER,
    temperature REAL,
    weight REAL,
    height REAL,
    bmi REAL,
    medical_questions_answered INTEGER DEFAULT 0,
    risk_factors TEXT,
    screening_result TEXT DEFAULT 'eligible',
    deferral_reason TEXT,
    deferral_period_days INTEGER,
    screening_notes TEXT,
    staff_id INTEGER,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS EmergencyAlerts (
    alert_id INTEGER PRIMARY KEY AUTOINCREMENT,
    alert_type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    priority TEXT DEFAULT 'medium',
    blood_type TEXT,
    units_needed INTEGER,
    hospital_id INTEGER,
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    resolved_at TEXT,
    resolved_by INTEGER
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS AuditLog (
    log_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    action TEXT NOT NULL,
    table_name TEXT,
    record_id INTEGER,
    old_values TEXT,
    new_values TEXT,
    ip_address TEXT,
    user_agent TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS BloodTestResults (
    test_id INTEGER PRIMARY KEY AUTOINCREMENT,
    inventory_id INTEGER NOT NULL,
    test_type TEXT NOT NULL,
    test_result TEXT NOT NULL,
    test_date TEXT NOT NULL,
    lab_technician TEXT,
    test_notes TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`);

  // Insert sample data if tables are empty
  db.get("SELECT COUNT(*) as count FROM Users", (err, row) => {
    if (row && row.count === 0) {
      // Insert sample users
      const sampleUsers = [
        ['admin', 'admin@bloodbank.com', '$2b$10$hash', 'System Administrator', 'admin', '+1234567890', 1],
        ['dr.smith', 'dr.smith@cityhospital.com', '$2b$10$hash', 'Dr. John Smith', 'doctor', '+1234567891', 1],
        ['nurse.jones', 'nurse.jones@cityhospital.com', '$2b$10$hash', 'Nurse Sarah Jones', 'nurse', '+1234567892', 1],
        ['staff.wilson', 'staff.wilson@bloodbank.com', '$2b$10$hash', 'Mike Wilson', 'staff', '+1234567893', 1]
      ];
      
      sampleUsers.forEach(user => {
        db.run('INSERT INTO Users (username, email, password_hash, full_name, role, phone, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)', user);
      });
    }
  });

  db.get("SELECT COUNT(*) as count FROM Donors", (err, row) => {
    if (row && row.count === 0) {
      // Insert sample donors
      const sampleDonors = [
        ['DON001', 'John', 'Doe', '1990-05-15', 33, 'M', 'A', '+', 75.5, 180.0, '+1234567890', 'john.doe@email.com', '123 Oak Street, New York, NY', 'Jane Doe', '+1234567891', 'None', 'None', 'None', '2024-01-15', '2024-03-15', 5, 'active'],
        ['DON002', 'Sarah', 'Johnson', '1985-08-22', 38, 'F', 'O', '-', 62.0, 165.0, '+1234567892', 'sarah.johnson@email.com', '456 Pine Avenue, Los Angeles, CA', 'Mike Johnson', '+1234567893', 'Asthma (controlled)', 'Inhaler', 'None', '2024-02-01', '2024-04-01', 8, 'active'],
        ['DON003', 'Michael', 'Brown', '1992-03-10', 31, 'M', 'B', '+', 80.0, 175.0, '+1234567894', 'michael.brown@email.com', '789 Elm Road, Chicago, IL', 'Lisa Brown', '+1234567895', 'None', 'None', 'Penicillin', '2024-01-20', '2024-03-20', 3, 'active']
      ];
      
      sampleDonors.forEach(donor => {
        db.run('INSERT INTO Donors (donor_code, first_name, last_name, date_of_birth, age, gender, blood_type, rh_factor, weight, height, phone, email, address, emergency_contact, emergency_phone, medical_history, medications, allergies, last_donation_date, next_eligible_date, total_donations, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', donor);
      });
    }
  });
});

// ==================== AUTHENTICATION ENDPOINTS ====================

// User login
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  
  db.get('SELECT * FROM Users WHERE username = ? AND is_active = 1', [username], async (err, user) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    
    // In production, verify password with bcrypt
    // const isValid = await bcrypt.compare(password, user.password_hash);
    // if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });
    
    // For demo, accept any password
    res.json({
      user: {
        id: user.user_id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        role: user.role
      },
      token: 'demo-token-' + user.user_id
    });
  });
});

// ==================== DONORS ENDPOINTS ====================

// Get all donors
app.get('/api/donors', (req, res) => {
  const { search, blood_type, status, page = 1, limit = 20 } = req.query;
  let query = 'SELECT * FROM Donors WHERE 1=1';
  let params = [];
  
  if (search) {
    query += ' AND (first_name LIKE ? OR last_name LIKE ? OR donor_code LIKE ?)';
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }
  
  if (blood_type) {
    query += ' AND blood_type = ?';
    params.push(blood_type);
  }
  
  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }
  
  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));
  
  db.all(query, params, (err, donors) => {
    if (err) return res.status(500).json({ error: err.message });
    
    // Get total count for pagination
    db.get('SELECT COUNT(*) as total FROM Donors', (err, countResult) => {
      if (err) return res.status(500).json({ error: err.message });
      
      res.json({
        donors,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: countResult.total,
          pages: Math.ceil(countResult.total / parseInt(limit))
        }
      });
    });
  });
});

// Get donor by ID
app.get('/api/donors/:id', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM Donors WHERE donor_id = ?', [id], (err, donor) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!donor) return res.status(404).json({ error: 'Donor not found' });
    
    res.json(donor);
  });
});

// Create new donor
app.post('/api/donors', (req, res) => {
  const donor = req.body;
  
  const requiredFields = ['donor_code', 'first_name', 'last_name', 'date_of_birth', 'gender', 'blood_type', 'rh_factor'];
  for (const field of requiredFields) {
    if (!donor[field]) {
      return res.status(400).json({ error: `Missing required field: ${field}` });
    }
  }
  
  db.run('INSERT INTO Donors (donor_code, first_name, last_name, date_of_birth, age, gender, blood_type, rh_factor, weight, height, phone, email, address, emergency_contact, emergency_phone, medical_history, medications, allergies) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [donor.donor_code, donor.first_name, donor.last_name, donor.date_of_birth, donor.age, donor.gender, donor.blood_type, donor.rh_factor, donor.weight, donor.height, donor.phone, donor.email, donor.address, donor.emergency_contact, donor.emergency_phone, donor.medical_history, donor.medications, donor.allergies],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      
      res.status(201).json({
        message: 'Donor created successfully',
        donor_id: this.lastID
      });
    });
});

// Update donor
app.put('/api/donors/:id', (req, res) => {
  const { id } = req.params;
  const donor = req.body;
  
  db.run('UPDATE Donors SET first_name = ?, last_name = ?, date_of_birth = ?, age = ?, gender = ?, blood_type = ?, rh_factor = ?, weight = ?, height = ?, phone = ?, email = ?, address = ?, emergency_contact = ?, emergency_phone = ?, medical_history = ?, medications = ?, allergies = ?, status = ?, deferral_reason = ?, updated_at = CURRENT_TIMESTAMP WHERE donor_id = ?',
    [donor.first_name, donor.last_name, donor.date_of_birth, donor.age, donor.gender, donor.blood_type, donor.rh_factor, donor.weight, donor.height, donor.phone, donor.email, donor.address, donor.emergency_contact, donor.emergency_phone, donor.medical_history, donor.medications, donor.allergies, donor.status, donor.deferral_reason, id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Donor not found' });
      
      res.json({ message: 'Donor updated successfully' });
    });
});

// Delete donor
app.delete('/api/donors/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM Donors WHERE donor_id = ?', [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Donor not found' });
    
    res.json({ message: 'Donor deleted successfully' });
  });
});

// ==================== BLOOD INVENTORY ENDPOINTS ====================

// Get blood inventory
app.get('/api/inventory', (req, res) => {
  const { blood_type, status, expiry_soon } = req.query;
  let query = 'SELECT bi.*, d.first_name, d.last_name FROM BloodInventory bi LEFT JOIN Donors d ON bi.donor_id = d.donor_id WHERE 1=1';
  let params = [];
  
  if (blood_type) {
    query += ' AND bi.blood_type = ?';
    params.push(blood_type);
  }
  
  if (status) {
    query += ' AND bi.status = ?';
    params.push(status);
  }
  
  if (expiry_soon === 'true') {
    query += ' AND bi.expiry_date <= date("now", "+30 days")';
  }
  
  query += ' ORDER BY bi.expiry_date ASC';
  
  db.all(query, params, (err, inventory) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(inventory);
  });
});

// Add blood to inventory
app.post('/api/inventory', (req, res) => {
  const inventory = req.body;
  
  db.run('INSERT INTO BloodInventory (donor_id, blood_type, rh_factor, units_available, collection_date, expiry_date, storage_location, storage_temperature, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [inventory.donor_id, inventory.blood_type, inventory.rh_factor, inventory.units_available, inventory.collection_date, inventory.expiry_date, inventory.storage_location, inventory.storage_temperature, inventory.notes],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      
      res.status(201).json({
        message: 'Blood inventory added successfully',
        inventory_id: this.lastID
      });
    });
});

// ==================== HOSPITALS ENDPOINTS ====================

// Get all hospitals
app.get('/api/hospitals', (req, res) => {
  db.all('SELECT * FROM Hospitals ORDER BY hospital_name', (err, hospitals) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(hospitals);
  });
});

// ==================== BLOOD REQUESTS ENDPOINTS ====================

// Get blood requests
app.get('/api/requests', (req, res) => {
  const { status, urgency_level, hospital_id } = req.query;
  let query = 'SELECT br.*, h.hospital_name FROM BloodRequests br LEFT JOIN Hospitals h ON br.hospital_id = h.hospital_id WHERE 1=1';
  let params = [];
  
  if (status) {
    query += ' AND br.status = ?';
    params.push(status);
  }
  
  if (urgency_level) {
    query += ' AND br.urgency_level = ?';
    params.push(urgency_level);
  }
  
  if (hospital_id) {
    query += ' AND br.hospital_id = ?';
    params.push(hospital_id);
  }
  
  query += ' ORDER BY br.created_at DESC';
  
  db.all(query, params, (err, requests) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(requests);
  });
});

// Create blood request
app.post('/api/requests', (req, res) => {
  const request = req.body;
  
  db.run('INSERT INTO BloodRequests (hospital_id, requesting_doctor, patient_name, blood_type, rh_factor, units_requested, urgency_level, request_date, required_date, diagnosis, special_requirements) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [request.hospital_id, request.requesting_doctor, request.patient_name, request.blood_type, request.rh_factor, request.units_requested, request.urgency_level, request.request_date, request.required_date, request.diagnosis, request.special_requirements],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      
      res.status(201).json({
        message: 'Blood request created successfully',
        request_id: this.lastID
      });
    });
});

// ==================== DASHBOARD ENDPOINTS ====================

// Get dashboard statistics
app.get('/api/dashboard/stats', (req, res) => {
  const stats = {};
  
  // Get donors count
  db.get('SELECT COUNT(*) as total FROM Donors WHERE status = "active"', (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    stats.totalDonors = result.total;
    
    // Get inventory count
    db.get('SELECT COUNT(*) as total FROM BloodInventory WHERE status = "available"', (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      stats.totalInventory = result.total;
      
      // Get hospitals count
      db.get('SELECT COUNT(*) as total FROM Hospitals WHERE accreditation_status = "accredited"', (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        stats.totalHospitals = result.total;
        
        // Get pending requests count
        db.get('SELECT COUNT(*) as total FROM BloodRequests WHERE status = "pending"', (err, result) => {
          if (err) return res.status(500).json({ error: err.message });
          stats.pendingRequests = result.total;
          
          // Get emergency alerts count
          db.get('SELECT COUNT(*) as total FROM EmergencyAlerts WHERE is_active = 1 AND priority IN ("high", "critical")', (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            stats.activeAlerts = result.total;
            
            res.json(stats);
          });
        });
      });
    });
  });
});

// Get blood type distribution
app.get('/api/dashboard/blood-types', (req, res) => {
  db.all('SELECT blood_type, rh_factor, COUNT(*) as count FROM Donors WHERE status = "active" GROUP BY blood_type, rh_factor', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Get recent activity
app.get('/api/dashboard/activity', (req, res) => {
  db.all(`
    SELECT 'donor' as type, d.first_name, d.last_name, d.created_at as date, 'New donor registered' as description
    FROM Donors d 
    ORDER BY d.created_at DESC 
    LIMIT 5
  `, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ==================== COMPATIBILITY ENDPOINTS ====================

// Check blood compatibility
app.get('/api/compatibility/:donorType/:donorRh/:recipientType/:recipientRh', (req, res) => {
  const { donorType, donorRh, recipientType, recipientRh } = req.params;
  
  db.get('SELECT * FROM BloodCompatibility WHERE donor_blood_type = ? AND donor_rh_factor = ? AND recipient_blood_type = ? AND recipient_rh_factor = ?',
    [donorType, donorRh, recipientType, recipientRh], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      
      if (result) {
        res.json({
          compatible: result.is_compatible === 1,
          notes: result.compatibility_notes
        });
      } else {
        // Basic compatibility rules if not in database
        let compatible = false;
        let notes = '';
        
        if (donorType === 'O') {
          compatible = true;
          notes = 'O blood type is universal donor';
        } else if (donorType === recipientType) {
          if (donorRh === '+' && recipientRh === '-') {
            compatible = false;
            notes = 'Rh+ cannot donate to Rh-';
          } else {
            compatible = true;
            notes = 'Direct blood type match';
          }
        } else if (recipientType === 'AB') {
          compatible = true;
          notes = 'AB blood type can receive from any type';
        }
        
        res.json({ compatible, notes });
      }
    });
});

// ==================== EMERGENCY ALERTS ENDPOINTS ====================

// Get active alerts
app.get('/api/alerts', (req, res) => {
  const { priority, alert_type } = req.query;
  let query = 'SELECT * FROM EmergencyAlerts WHERE is_active = 1';
  let params = [];
  
  if (priority) {
    query += ' AND priority = ?';
    params.push(priority);
  }
  
  if (alert_type) {
    query += ' AND alert_type = ?';
    params.push(alert_type);
  }
  
  query += ' ORDER BY priority DESC, created_at DESC';
  
  db.all(query, params, (err, alerts) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(alerts);
  });
});

// ==================== LEGACY ENDPOINTS (for backward compatibility) ====================

// Legacy donors endpoint
app.get('/donors', (req, res) => {
  db.all('SELECT * FROM Donors', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Legacy recipients endpoint
app.get('/recipients', (req, res) => {
  db.all('SELECT * FROM Recipients', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Legacy hospitals endpoint
app.get('/hospitals', (req, res) => {
  db.all('SELECT * FROM Hospitals', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Blood Bank Management System running on port ${PORT}`);
  console.log(`📊 Database: ${dbPath}`);
  console.log(`🔗 API Base: http://localhost:${PORT}/api`);
});
