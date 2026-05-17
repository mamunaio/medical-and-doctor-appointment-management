import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import Department from '../models/Department';
import Bed from '../models/Bed';
import HospitalSettings from '../models/HospitalSettings';
import LabTest from '../models/LabTest';
import Medicine from '../models/Medicine';
import Patient from '../models/Patient';
import Appointment from '../models/Appointment';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Please define MONGODB_URI in .env.local');
  process.exit(1);
}

const seed = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Department.deleteMany({}),
      Bed.deleteMany({}),
      HospitalSettings.deleteMany({}),
      LabTest.deleteMany({}),
      Medicine.deleteMany({}),
      Patient.deleteMany({}),
      Appointment.deleteMany({}),
    ]);

    console.log('Cleared existing data.');

    // 1. Hospital Settings
    await HospitalSettings.create({
      hospitalName: 'Injaazh HMS',
      address: 'House 12, Road 5, Dhanmondi, Dhaka',
      phone: ['+8801700000000', '+8801800000000'],
      email: 'contact@injaazh.com',
      website: 'https://injaazh.com',
      billing: { taxRate: 5, currency: 'BDT', invoicePrefix: 'INV' },
      appointment: { defaultSlotDuration: 20, advanceBookingDays: 30, reminderHours: 24, autoConfirm: true }
    });

    // 2. Departments
    const deptsData = [
      { name: 'Cardiology', code: 'CARD', color: '#EF4444' },
      { name: 'Orthopedics', code: 'ORTH', color: '#F59E0B' },
      { name: 'Neurology', code: 'NEUR', color: '#8B5CF6' },
      { name: 'Gynecology', code: 'GYNE', color: '#EC4899' },
      { name: 'Pediatrics', code: 'PEDI', color: '#10B981' },
      { name: 'General Medicine', code: 'GENM', color: '#3B82F6' },
      { name: 'Surgery', code: 'SURG', color: '#6366F1' },
      { name: 'Emergency', code: 'EMER', color: '#B91C1C' },
      { name: 'Radiology', code: 'RADI', color: '#4B5563' },
      { name: 'Pathology', code: 'PATH', color: '#059669' },
      { name: 'Pharmacy', code: 'PHAR', color: '#0D9488' }
    ];
    const createdDepts = await Department.insertMany(deptsData);
    const cardiologyId = createdDepts.find(d => d.code === 'CARD')?._id;

    // 3. Admin Users
    const hashedPassword = await bcrypt.hash('injaazh_admin', 10);
    const admin = await User.create({
      name: 'Super Admin',
      email: 'admin@injaazh.com',
      phone: '01700000000',
      passwordHash: hashedPassword,
      role: 'super_admin',
      isVerified: true
    });

    // 4. Doctors
    const doctorPass = await bcrypt.hash('doctor123', 10);
    const doctors = await User.insertMany([
      {
        name: 'Dr. Akram Hossain',
        email: 'akram@injaazh.com',
        phone: '01711111111',
        passwordHash: doctorPass,
        role: 'doctor',
        doctorProfile: {
          bmdcNumber: 'A-12345',
          specialization: ['Interventional Cardiology'],
          designation: 'Senior Consultant',
          department: cardiologyId,
          consultationFee: 1000,
          experience: 15
        }
      },
      {
        name: 'Dr. Sarah Johnson',
        email: 'sarah@injaazh.com',
        phone: '01722222222',
        passwordHash: doctorPass,
        role: 'doctor',
        doctorProfile: {
          bmdcNumber: 'A-67890',
          specialization: ['Clinical Cardiology'],
          designation: 'Consultant',
          department: cardiologyId,
          consultationFee: 800,
          experience: 8
        }
      }
    ]);

    // 4.1 Nurse
    const nursePass = await bcrypt.hash('nurse123', 10);
    const nurse = await User.create({
      name: 'Nurse Emily',
      email: 'nurse@injaazh.com',
      phone: '01733333333',
      passwordHash: nursePass,
      role: 'nurse',
      isVerified: true,
      staffProfile: {
        employeeId: 'NUR-001',
        department: cardiologyId,
        designation: 'Senior Staff Nurse',
        joinDate: new Date(),
        shift: 'morning'
      }
    });

    // 4.2 Receptionist
    const receptionistPass = await bcrypt.hash('receptionist123', 10);
    const receptionist = await User.create({
      name: 'Receptionist Sarah',
      email: 'receptionist@injaazh.com',
      phone: '01744444444',
      passwordHash: receptionistPass,
      role: 'receptionist',
      isVerified: true,
      staffProfile: {
        employeeId: 'REC-001',
        department: cardiologyId,
        designation: 'Front Desk Officer',
        joinDate: new Date(),
        shift: 'morning'
      }
    });

    // 4.3 Patient User Account
    const patientPass = await bcrypt.hash('patient123', 10);
    const patientUser = await User.create({
      name: 'Abul Kashem',
      email: 'patient@injaazh.com',
      phone: '01911111111',
      passwordHash: patientPass,
      role: 'patient',
      isVerified: true
    });

    // 5. Beds
    const wards = ['general', 'cabin', 'icu', 'ccu', 'emergency'];
    const beds = [];
    for (const ward of wards) {
      for (let i = 1; i <= 5; i++) {
        beds.push({
          bedNumber: `${ward.charAt(0).toUpperCase()}-${i}`,
          ward: ward,
          bedType: ward === 'icu' ? 'icu' : ward === 'cabin' ? 'cabin' : 'standard',
          status: 'available',
          dailyRate: ward === 'icu' ? 5000 : ward === 'cabin' ? 3000 : 500
        });
      }
    }
    await Bed.insertMany(beds);

    // 6. Lab Tests
    await LabTest.insertMany([
      { testName: 'Complete Blood Count', testCode: 'CBC', category: 'Hematology', price: 450, tat: 4 },
      { testName: 'Lipid Profile', testCode: 'LIPID', category: 'Biochemistry', price: 1200, tat: 6 },
      { testName: 'Serum Creatinine', testCode: 'CREAT', category: 'Biochemistry', price: 350, tat: 4 }
    ]);

    // 7. Medicines
    await Medicine.insertMany([
      { name: 'Napa Extend', genericName: 'Paracetamol', category: 'tablet', strength: '665mg', stock: 500, sellingPrice: 2 },
      { name: 'Sergel', genericName: 'Esomeprazole', category: 'capsule', strength: '20mg', stock: 1000, sellingPrice: 7 },
      { name: 'Alatrol', genericName: 'Cetirizine', category: 'tablet', strength: '10mg', stock: 300, sellingPrice: 3.5 }
    ]);

    // 8. Patients
    const patients = await Patient.insertMany([
      {
        userId: patientUser._id,
        patientId: 'PAT-2024-00001',
        name: 'Abul Kashem',
        email: 'patient@injaazh.com',
        phone: '01911111111',
        gender: 'male',
        age: 45,
        bloodGroup: 'A+',
        address: { division: 'Dhaka', district: 'Dhaka', thana: 'Dhanmondi', village: 'Sukrabad' }
      },
      {
        patientId: 'PAT-2024-00002',
        name: 'Rahima Khatun',
        phone: '01922222222',
        gender: 'female',
        age: 38,
        bloodGroup: 'O+',
        address: { division: 'Dhaka', district: 'Dhaka', thana: 'Mirpur', village: 'Sector 10' }
      }
    ]);

    // 9. Appointments
    await Appointment.create({
      appointmentId: 'APT-2024-00001',
      patient: patients[0]._id,
      doctor: doctors[0]._id,
      department: cardiologyId,
      date: new Date(),
      timeSlot: '10:00-10:20',
      tokenNumber: 1,
      status: 'booked',
      type: 'consultation'
    });

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seed();
