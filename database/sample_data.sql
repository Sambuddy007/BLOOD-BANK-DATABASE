-- Comprehensive Sample Data for Blood Bank Management System

-- Insert Users (password_hash would be bcrypt hashed in production)
INSERT INTO Users (username, email, password_hash, full_name, role, phone, is_active) VALUES
('admin', 'admin@bloodbank.com', '$2b$10$hash', 'System Administrator', 'admin', '+1234567890', 1),
('dr.smith', 'dr.smith@cityhospital.com', '$2b$10$hash', 'Dr. John Smith', 'doctor', '+1234567891', 1),
('nurse.jones', 'nurse.jones@cityhospital.com', '$2b$10$hash', 'Nurse Sarah Jones', 'nurse', '+1234567892', 1),
('staff.wilson', 'staff.wilson@bloodbank.com', '$2b$10$hash', 'Mike Wilson', 'staff', '+1234567893', 1),
('dr.brown', 'dr.brown@generalhospital.com', '$2b$10$hash', 'Dr. Emily Brown', 'doctor', '+1234567894', 1);

-- Insert Hospitals
INSERT INTO Hospitals (hospital_name, hospital_code, address, city, state, country, phone, email, contact_person, license_number, accreditation_status) VALUES
('City General Hospital', 'CGH001', '123 Main Street', 'New York', 'NY', 'USA', '+1234567890', 'info@cityhospital.com', 'Dr. John Smith', 'LIC001', 'accredited'),
('General Medical Center', 'GMC002', '456 Oak Avenue', 'Los Angeles', 'CA', 'USA', '+1234567891', 'info@generalhospital.com', 'Dr. Emily Brown', 'LIC002', 'accredited'),
('Community Health Center', 'CHC003', '789 Pine Road', 'Chicago', 'IL', 'USA', '+1234567892', 'info@communityhealth.com', 'Dr. Michael Davis', 'LIC003', 'pending'),
('Emergency Trauma Center', 'ETC004', '321 Elm Street', 'Houston', 'TX', 'USA', '+1234567893', 'info@emergencytrauma.com', 'Dr. Sarah Wilson', 'LIC004', 'accredited');

-- Insert Donors with comprehensive information
INSERT INTO Donors (donor_code, first_name, last_name, date_of_birth, age, gender, blood_type, rh_factor, weight, height, phone, email, address, emergency_contact, emergency_phone, medical_history, medications, allergies, last_donation_date, next_eligible_date, total_donations, status) VALUES
('DON001', 'John', 'Doe', '1990-05-15', 33, 'M', 'A', '+', 75.5, 180.0, '+1234567890', 'john.doe@email.com', '123 Oak Street, New York, NY', 'Jane Doe', '+1234567891', 'None', 'None', 'None', '2024-01-15', '2024-03-15', 5, 'active'),
('DON002', 'Sarah', 'Johnson', '1985-08-22', 38, 'F', 'O', '-', 62.0, 165.0, '+1234567892', 'sarah.johnson@email.com', '456 Pine Avenue, Los Angeles, CA', 'Mike Johnson', '+1234567893', 'Asthma (controlled)', 'Inhaler', 'None', '2024-02-01', '2024-04-01', 8, 'active'),
('DON003', 'Michael', 'Brown', '1992-03-10', 31, 'M', 'B', '+', 80.0, 175.0, '+1234567894', 'michael.brown@email.com', '789 Elm Road, Chicago, IL', 'Lisa Brown', '+1234567895', 'None', 'None', 'Penicillin', '2024-01-20', '2024-03-20', 3, 'active'),
('DON004', 'Emily', 'Davis', '1988-11-05', 35, 'F', 'AB', '+', 58.5, 160.0, '+1234567896', 'emily.davis@email.com', '321 Maple Drive, Houston, TX', 'Robert Davis', '+1234567897', 'None', 'None', 'None', '2024-02-10', '2024-04-10', 6, 'active'),
('DON005', 'David', 'Wilson', '1995-07-18', 28, 'M', 'O', '+', 85.0, 182.0, '+1234567898', 'david.wilson@email.com', '654 Cedar Lane, Miami, FL', 'Mary Wilson', '+1234567899', 'None', 'None', 'None', '2024-01-25', '2024-03-25', 4, 'active'),
('DON006', 'Lisa', 'Garcia', '1987-12-03', 36, 'F', 'A', '-', 55.0, 158.0, '+1234567900', 'lisa.garcia@email.com', '987 Birch Street, Phoenix, AZ', 'Carlos Garcia', '+1234567901', 'None', 'None', 'None', '2024-02-05', '2024-04-05', 7, 'active'),
('DON007', 'James', 'Martinez', '1993-09-14', 30, 'M', 'B', '-', 78.5, 177.0, '+1234567902', 'james.martinez@email.com', '147 Spruce Avenue, Denver, CO', 'Maria Martinez', '+1234567903', 'None', 'None', 'None', '2024-01-30', '2024-03-30', 2, 'active'),
('DON008', 'Jennifer', 'Taylor', '1986-04-28', 37, 'F', 'AB', '-', 60.0, 162.0, '+1234567904', 'jennifer.taylor@email.com', '258 Willow Road, Seattle, WA', 'Thomas Taylor', '+1234567905', 'None', 'None', 'None', '2024-02-15', '2024-04-15', 9, 'active');

-- Insert Recipients
INSERT INTO Recipients (patient_id, first_name, last_name, date_of_birth, age, gender, blood_type, rh_factor, weight, diagnosis, hospital_id, doctor_name, urgency_level) VALUES
('PAT001', 'Robert', 'Anderson', '1975-06-12', 48, 'M', 'A', '+', 82.0, 'Surgery - Hip Replacement', 1, 'Dr. John Smith', 'routine'),
('PAT002', 'Maria', 'Rodriguez', '1980-03-25', 43, 'F', 'O', '-', 65.0, 'Emergency - Car Accident', 2, 'Dr. Emily Brown', 'emergency'),
('PAT003', 'William', 'Thompson', '1968-11-08', 55, 'M', 'B', '+', 90.0, 'Cancer Treatment', 1, 'Dr. John Smith', 'urgent'),
('PAT004', 'Elizabeth', 'White', '1990-07-19', 33, 'F', 'AB', '+', 58.0, 'Surgery - Appendectomy', 3, 'Dr. Michael Davis', 'urgent'),
('PAT005', 'Christopher', 'Lee', '1982-12-04', 41, 'M', 'O', '+', 88.0, 'Emergency - Heart Attack', 4, 'Dr. Sarah Wilson', 'emergency');

-- Insert Blood Inventory
INSERT INTO BloodInventory (donor_id, blood_type, rh_factor, units_available, units_reserved, units_expired, collection_date, expiry_date, storage_location, storage_temperature, status, notes) VALUES
(1, 'A', '+', 15, 5, 0, '2024-01-15', '2024-04-15', 'Refrigerator A-1', 4.0, 'available', 'Good quality, no issues'),
(2, 'O', '-', 20, 8, 0, '2024-02-01', '2024-05-01', 'Refrigerator B-2', 4.0, 'available', 'Universal donor blood'),
(3, 'B', '+', 12, 3, 0, '2024-01-20', '2024-04-20', 'Refrigerator A-3', 4.0, 'available', 'Standard collection'),
(4, 'AB', '+', 8, 2, 0, '2024-02-10', '2024-05-10', 'Refrigerator B-1', 4.0, 'available', 'Rare blood type'),
(5, 'O', '+', 25, 10, 0, '2024-01-25', '2024-04-25', 'Refrigerator A-2', 4.0, 'available', 'High demand blood type'),
(6, 'A', '-', 10, 4, 0, '2024-02-05', '2024-05-05', 'Refrigerator B-3', 4.0, 'available', 'Good for specific recipients'),
(7, 'B', '-', 14, 6, 0, '2024-01-30', '2024-04-30', 'Refrigerator A-4', 4.0, 'available', 'Standard collection'),
(8, 'AB', '-', 6, 1, 0, '2024-02-15', '2024-05-15', 'Refrigerator B-4', 4.0, 'available', 'Very rare blood type');

-- Insert Donation Sessions
INSERT INTO DonationSessions (donor_id, session_date, start_time, end_time, blood_volume_ml, hemoglobin_level, blood_pressure_systolic, blood_pressure_diastolic, pulse_rate, temperature, staff_id, location, session_notes, status) VALUES
(1, '2024-01-15', '09:00:00', '09:45:00', 450, 14.2, 120, 80, 72, 36.8, 4, 'Main Donation Center', 'Smooth donation, donor felt well', 'completed'),
(2, '2024-02-01', '10:00:00', '10:50:00', 450, 13.8, 118, 78, 70, 36.9, 4, 'Main Donation Center', 'Good hemoglobin level, no issues', 'completed'),
(3, '2024-01-20', '14:00:00', '14:40:00', 450, 14.5, 125, 82, 75, 36.7, 4, 'Main Donation Center', 'Standard donation process', 'completed'),
(4, '2024-02-10', '11:00:00', '11:45:00', 450, 13.9, 122, 79, 68, 36.8, 4, 'Main Donation Center', 'AB+ donor, valuable contribution', 'completed'),
(5, '2024-01-25', '15:00:00', '15:35:00', 450, 14.1, 120, 80, 72, 36.9, 4, 'Main Donation Center', 'O+ donor, high demand', 'completed'),
(6, '2024-02-05', '13:00:00', '13:50:00', 450, 14.3, 119, 78, 70, 36.7, 4, 'Main Donation Center', 'A- donor, good for specific needs', 'completed'),
(7, '2024-01-30', '16:00:00', '16:40:00', 450, 14.0, 123, 81, 74, 36.8, 4, 'Main Donation Center', 'B- donor, standard collection', 'completed'),
(8, '2024-02-15', '12:00:00', '12:45:00', 450, 14.4, 121, 79, 71, 36.9, 4, 'Main Donation Center', 'AB- donor, very rare', 'completed');

-- Insert Blood Requests
INSERT INTO BloodRequests (hospital_id, requesting_doctor, patient_name, blood_type, rh_factor, units_requested, urgency_level, request_date, required_date, diagnosis, special_requirements, status, approved_by, approved_at) VALUES
(1, 'Dr. John Smith', 'Robert Anderson', 'A', '+', 4, 'routine', '2024-02-20', '2024-02-25', 'Surgery - Hip Replacement', 'None', 'approved', 1, '2024-02-20 10:00:00'),
(2, 'Dr. Emily Brown', 'Maria Rodriguez', 'O', '-', 6, 'emergency', '2024-02-21', '2024-02-21', 'Emergency - Car Accident', 'Immediate availability required', 'fulfilled', 1, '2024-02-21 08:00:00'),
(1, 'Dr. John Smith', 'William Thompson', 'B', '+', 8, 'urgent', '2024-02-22', '2024-02-24', 'Cancer Treatment', 'Multiple units for chemotherapy', 'approved', 1, '2024-02-22 14:00:00'),
(3, 'Dr. Michael Davis', 'Elizabeth White', 'AB', '+', 3, 'urgent', '2024-02-23', '2024-02-25', 'Surgery - Appendectomy', 'None', 'pending', NULL, NULL),
(4, 'Dr. Sarah Wilson', 'Christopher Lee', 'O', '+', 10, 'emergency', '2024-02-24', '2024-02-24', 'Emergency - Heart Attack', 'Immediate availability required', 'fulfilled', 1, '2024-02-24 07:00:00');

-- Insert Blood Compatibility Rules
INSERT INTO BloodCompatibility (donor_blood_type, donor_rh_factor, recipient_blood_type, recipient_rh_factor, is_compatible, compatibility_notes) VALUES
('A', '+', 'A', '+', 1, 'Direct match'),
('A', '+', 'A', '-', 1, 'Rh+ can donate to Rh-'),
('A', '-', 'A', '+', 0, 'Rh- cannot donate to Rh+'),
('A', '-', 'A', '-', 1, 'Direct match'),
('O', '+', 'A', '+', 1, 'O+ is universal donor for Rh+'),
('O', '+', 'A', '-', 1, 'O+ is universal donor for Rh+'),
('O', '-', 'A', '+', 1, 'O- is universal donor'),
('O', '-', 'A', '-', 1, 'O- is universal donor'),
('B', '+', 'B', '+', 1, 'Direct match'),
('B', '+', 'B', '-', 1, 'Rh+ can donate to Rh-'),
('B', '-', 'B', '+', 0, 'Rh- cannot donate to Rh+'),
('B', '-', 'B', '-', 1, 'Direct match'),
('AB', '+', 'AB', '+', 1, 'Direct match'),
('AB', '+', 'AB', '-', 1, 'Rh+ can donate to Rh-'),
('AB', '-', 'AB', '+', 0, 'Rh- cannot donate to Rh+'),
('AB', '-', 'AB', '-', 1, 'Direct match');

-- Insert Blood Drives
INSERT INTO BloodDrives (drive_name, drive_date, start_time, end_time, location, organizer, target_donors, actual_donors, status, notes) VALUES
('Spring Community Blood Drive', '2024-03-15', '09:00:00', '17:00:00', 'Community Center, 123 Main St', 'Red Cross', 50, 0, 'planned', 'Annual spring blood drive'),
('Corporate Blood Drive - Tech Corp', '2024-03-20', '10:00:00', '16:00:00', 'Tech Corp Headquarters', 'Tech Corp HR', 30, 0, 'planned', 'Corporate wellness initiative'),
('University Blood Drive', '2024-03-25', '11:00:00', '19:00:00', 'University Campus', 'Student Health Services', 40, 0, 'planned', 'Student health awareness'),
('Emergency Response Blood Drive', '2024-02-28', '08:00:00', '20:00:00', 'Emergency Center', 'Emergency Services', 100, 0, 'planned', 'Emergency preparedness');

-- Insert Health Screening Records
INSERT INTO HealthScreening (donor_id, session_id, screening_date, hemoglobin_level, blood_pressure_systolic, blood_pressure_diastolic, pulse_rate, temperature, weight, height, bmi, medical_questions_answered, risk_factors, screening_result, screening_notes, staff_id) VALUES
(1, 1, '2024-01-15', 14.2, 120, 80, 72, 36.8, 75.5, 180.0, 23.3, 1, 'None', 'eligible', 'All parameters within normal range', 4),
(2, 2, '2024-02-01', 13.8, 118, 78, 70, 36.9, 62.0, 165.0, 22.8, 1, 'Controlled asthma', 'eligible', 'Asthma well controlled, no current symptoms', 4),
(3, 3, '2024-01-20', 14.5, 125, 82, 75, 36.7, 80.0, 175.0, 26.1, 1, 'None', 'eligible', 'Slightly elevated BP, but within acceptable range', 4),
(4, 4, '2024-02-10', 13.9, 122, 79, 68, 36.8, 58.5, 160.0, 22.9, 1, 'None', 'eligible', 'All parameters normal', 4),
(5, 5, '2024-01-25', 14.1, 120, 80, 72, 36.9, 85.0, 182.0, 25.7, 1, 'None', 'eligible', 'Good health parameters', 4);

-- Insert Emergency Alerts
INSERT INTO EmergencyAlerts (alert_type, title, message, priority, blood_type, units_needed, hospital_id, is_active) VALUES
('low_inventory', 'Low O- Blood Supply', 'O- blood type inventory is below critical level. Only 5 units remaining.', 'critical', 'O', 15, 2, 1),
('expiry_warning', 'Blood Expiry Warning', '10 units of A+ blood will expire in 7 days. Please prioritize usage.', 'high', 'A', 10, NULL, 1),
('urgent_request', 'Emergency Blood Request', 'City Hospital needs 8 units of B+ blood immediately for emergency surgery.', 'critical', 'B', 8, 1, 1),
('system_alert', 'System Maintenance', 'Scheduled system maintenance tonight from 2-4 AM. Some features may be unavailable.', 'low', NULL, NULL, NULL, 1);

-- Insert Blood Test Results
INSERT INTO BloodTestResults (inventory_id, test_type, test_result, test_date, lab_technician, test_notes) VALUES
(1, 'hiv', 'negative', '2024-01-16', 'Lab Tech 1', 'Standard screening completed'),
(1, 'hepatitis_b', 'negative', '2024-01-16', 'Lab Tech 1', 'Standard screening completed'),
(1, 'hepatitis_c', 'negative', '2024-01-16', 'Lab Tech 1', 'Standard screening completed'),
(1, 'syphilis', 'negative', '2024-01-16', 'Lab Tech 1', 'Standard screening completed'),
(2, 'hiv', 'negative', '2024-02-02', 'Lab Tech 2', 'Standard screening completed'),
(2, 'hepatitis_b', 'negative', '2024-02-02', 'Lab Tech 2', 'Standard screening completed'),
(2, 'hepatitis_c', 'negative', '2024-02-02', 'Lab Tech 2', 'Standard screening completed'),
(2, 'syphilis', 'negative', '2024-02-02', 'Lab Tech 2', 'Standard screening completed'),
(3, 'hiv', 'negative', '2024-01-21', 'Lab Tech 1', 'Standard screening completed'),
(3, 'hepatitis_b', 'negative', '2024-01-21', 'Lab Tech 1', 'Standard screening completed'),
(3, 'hepatitis_c', 'negative', '2024-01-21', 'Lab Tech 1', 'Standard screening completed'),
(3, 'syphilis', 'negative', '2024-01-21', 'Lab Tech 1', 'Standard screening completed');

-- Insert Audit Log Entries
INSERT INTO AuditLog (user_id, action, table_name, record_id, old_values, new_values, ip_address, user_agent) VALUES
(1, 'CREATE', 'Users', 1, NULL, '{"username":"admin","role":"admin"}', '192.168.1.100', 'Mozilla/5.0'),
(1, 'CREATE', 'Hospitals', 1, NULL, '{"hospital_name":"City General Hospital"}', '192.168.1.100', 'Mozilla/5.0'),
(1, 'CREATE', 'Donors', 1, NULL, '{"donor_code":"DON001","blood_type":"A"}', '192.168.1.100', 'Mozilla/5.0'),
(4, 'CREATE', 'BloodInventory', 1, NULL, '{"blood_type":"A","units_available":15}', '192.168.1.101', 'Mozilla/5.0'),
(1, 'APPROVE', 'BloodRequests', 1, '{"status":"pending"}', '{"status":"approved"}', '192.168.1.100', 'Mozilla/5.0');
