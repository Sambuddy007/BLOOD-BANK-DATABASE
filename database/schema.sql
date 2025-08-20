-- Blood Bank Management System - Complete Database Schema
-- This schema supports a full production blood bank application

-- Users and Authentication
CREATE TABLE Users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role ENUM('admin', 'staff', 'doctor', 'nurse') NOT NULL,
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Blood Donors with enhanced information
CREATE TABLE Donors (
    donor_id INTEGER PRIMARY KEY AUTOINCREMENT,
    donor_code VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    date_of_birth DATE NOT NULL,
    age INTEGER,
    gender ENUM('M', 'F', 'Other') NOT NULL,
    blood_type VARCHAR(5) NOT NULL,
    rh_factor ENUM('+', '-') NOT NULL,
    weight DECIMAL(5,2),
    height DECIMAL(5,2),
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    emergency_contact VARCHAR(100),
    emergency_phone VARCHAR(20),
    medical_history TEXT,
    medications TEXT,
    allergies TEXT,
    last_donation_date DATE,
    next_eligible_date DATE,
    total_donations INTEGER DEFAULT 0,
    status ENUM('active', 'inactive', 'deferred', 'permanent_deferral') DEFAULT 'active',
    deferral_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blood Recipients
CREATE TABLE Recipients (
    recipient_id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id VARCHAR(50),
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    date_of_birth DATE,
    age INTEGER,
    gender ENUM('M', 'F', 'Other'),
    blood_type VARCHAR(5) NOT NULL,
    rh_factor ENUM('+', '-') NOT NULL,
    weight DECIMAL(5,2),
    diagnosis TEXT,
    hospital_id INTEGER,
    doctor_name VARCHAR(100),
    urgency_level ENUM('routine', 'urgent', 'emergency') DEFAULT 'routine',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Hospitals and Medical Centers
CREATE TABLE Hospitals (
    hospital_id INTEGER PRIMARY KEY AUTOINCREMENT,
    hospital_name VARCHAR(200) NOT NULL,
    hospital_code VARCHAR(20) UNIQUE,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(100),
    contact_person VARCHAR(100),
    license_number VARCHAR(50),
    accreditation_status ENUM('accredited', 'pending', 'expired') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blood Inventory Management
CREATE TABLE BloodInventory (
    inventory_id INTEGER PRIMARY KEY AUTOINCREMENT,
    donor_id INTEGER,
    blood_type VARCHAR(5) NOT NULL,
    rh_factor ENUM('+', '-') NOT NULL,
    units_available INTEGER NOT NULL,
    units_reserved INTEGER DEFAULT 0,
    units_expired INTEGER DEFAULT 0,
    collection_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    storage_location VARCHAR(100),
    storage_temperature DECIMAL(4,2),
    status ENUM('available', 'reserved', 'expired', 'quarantined', 'transfused') DEFAULT 'available',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (donor_id) REFERENCES Donors(donor_id)
);

-- Blood Donation Sessions
CREATE TABLE DonationSessions (
    session_id INTEGER PRIMARY KEY AUTOINCREMENT,
    donor_id INTEGER NOT NULL,
    session_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    blood_volume_ml INTEGER,
    hemoglobin_level DECIMAL(4,2),
    blood_pressure_systolic INTEGER,
    blood_pressure_diastolic INTEGER,
    pulse_rate INTEGER,
    temperature DECIMAL(4,2),
    staff_id INTEGER,
    location VARCHAR(100),
    session_notes TEXT,
    status ENUM('scheduled', 'in_progress', 'completed', 'cancelled') DEFAULT 'scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (donor_id) REFERENCES Donors(donor_id),
    FOREIGN KEY (staff_id) REFERENCES Users(user_id)
);

-- Blood Requests from Hospitals
CREATE TABLE BloodRequests (
    request_id INTEGER PRIMARY KEY AUTOINCREMENT,
    hospital_id INTEGER NOT NULL,
    requesting_doctor VARCHAR(100),
    patient_name VARCHAR(100),
    blood_type VARCHAR(5) NOT NULL,
    rh_factor ENUM('+', '-') NOT NULL,
    units_requested INTEGER NOT NULL,
    urgency_level ENUM('routine', 'urgent', 'emergency') DEFAULT 'routine',
    request_date DATE NOT NULL,
    required_date DATE NOT NULL,
    diagnosis TEXT,
    special_requirements TEXT,
    status ENUM('pending', 'approved', 'fulfilled', 'cancelled', 'rejected') DEFAULT 'pending',
    approved_by INTEGER,
    approved_at TIMESTAMP,
    fulfillment_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (hospital_id) REFERENCES Hospitals(hospital_id),
    FOREIGN KEY (approved_by) REFERENCES Users(user_id)
);

-- Blood Transfusions
CREATE TABLE BloodTransfusions (
    transfusion_id INTEGER PRIMARY KEY AUTOINCREMENT,
    request_id INTEGER,
    recipient_id INTEGER,
    inventory_id INTEGER,
    transfusion_date DATE NOT NULL,
    units_transfused INTEGER NOT NULL,
    staff_id INTEGER,
    transfusion_notes TEXT,
    complications TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (request_id) REFERENCES BloodRequests(request_id),
    FOREIGN KEY (recipient_id) REFERENCES Recipients(recipient_id),
    FOREIGN KEY (inventory_id) REFERENCES BloodInventory(inventory_id),
    FOREIGN KEY (staff_id) REFERENCES Users(user_id)
);

-- Blood Compatibility Rules
CREATE TABLE BloodCompatibility (
    compatibility_id INTEGER PRIMARY KEY AUTOINCREMENT,
    donor_blood_type VARCHAR(5) NOT NULL,
    donor_rh_factor ENUM('+', '-') NOT NULL,
    recipient_blood_type VARCHAR(5) NOT NULL,
    recipient_rh_factor ENUM('+', '-') NOT NULL,
    is_compatible BOOLEAN NOT NULL,
    compatibility_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blood Drives and Campaigns
CREATE TABLE BloodDrives (
    drive_id INTEGER PRIMARY KEY AUTOINCREMENT,
    drive_name VARCHAR(200) NOT NULL,
    drive_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    location VARCHAR(200),
    organizer VARCHAR(100),
    target_donors INTEGER,
    actual_donors INTEGER DEFAULT 0,
    status ENUM('planned', 'active', 'completed', 'cancelled') DEFAULT 'planned',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Donor Health Screening
CREATE TABLE HealthScreening (
    screening_id INTEGER PRIMARY KEY AUTOINCREMENT,
    donor_id INTEGER NOT NULL,
    session_id INTEGER,
    screening_date DATE NOT NULL,
    hemoglobin_level DECIMAL(4,2),
    blood_pressure_systolic INTEGER,
    blood_pressure_diastolic INTEGER,
    pulse_rate INTEGER,
    temperature DECIMAL(4,2),
    weight DECIMAL(5,2),
    height DECIMAL(5,2),
    bmi DECIMAL(4,2),
    medical_questions_answered BOOLEAN DEFAULT 0,
    risk_factors TEXT,
    screening_result ENUM('eligible', 'temporarily_deferred', 'permanently_deferred') DEFAULT 'eligible',
    deferral_reason TEXT,
    deferral_period_days INTEGER,
    screening_notes TEXT,
    staff_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (donor_id) REFERENCES Donors(donor_id),
    FOREIGN KEY (session_id) REFERENCES DonationSessions(session_id),
    FOREIGN KEY (staff_id) REFERENCES Users(user_id)
);

-- Emergency Alerts
CREATE TABLE EmergencyAlerts (
    alert_id INTEGER PRIMARY KEY AUTOINCREMENT,
    alert_type ENUM('low_inventory', 'expiry_warning', 'urgent_request', 'system_alert') NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    priority ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
    blood_type VARCHAR(5),
    units_needed INTEGER,
    hospital_id INTEGER,
    is_active BOOLEAN DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    resolved_by INTEGER,
    FOREIGN KEY (hospital_id) REFERENCES Hospitals(hospital_id),
    FOREIGN KEY (resolved_by) REFERENCES Users(user_id)
);

-- Audit Log for System Changes
CREATE TABLE AuditLog (
    log_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100),
    record_id INTEGER,
    old_values TEXT,
    new_values TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- Blood Test Results
CREATE TABLE BloodTestResults (
    test_id INTEGER PRIMARY KEY AUTOINCREMENT,
    inventory_id INTEGER NOT NULL,
    test_type ENUM('hiv', 'hepatitis_b', 'hepatitis_c', 'syphilis', 'malaria', 'other') NOT NULL,
    test_result ENUM('negative', 'positive', 'inconclusive') NOT NULL,
    test_date DATE NOT NULL,
    lab_technician VARCHAR(100),
    test_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (inventory_id) REFERENCES BloodInventory(inventory_id)
);

-- Create indexes for better performance
CREATE INDEX idx_donors_blood_type ON Donors(blood_type, rh_factor);
CREATE INDEX idx_inventory_status ON BloodInventory(status, expiry_date);
CREATE INDEX idx_requests_status ON BloodRequests(status, urgency_level);
CREATE INDEX idx_donors_status ON Donors(status);
CREATE INDEX idx_inventory_expiry ON BloodInventory(expiry_date);
CREATE INDEX idx_requests_blood_type ON BloodRequests(blood_type, rh_factor);
CREATE INDEX idx_donors_last_donation ON Donors(last_donation_date);
CREATE INDEX idx_sessions_donor_date ON DonationSessions(donor_id, session_date);
