const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Student = require('./models/Student');
const Company = require('./models/Company');
const Job = require('./models/Job');
const Application = require('./models/Application');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Student.deleteMany({}),
      Company.deleteMany({}),
      Job.deleteMany({}),
      Application.deleteMany({})
    ]);
    console.log('Cleared existing data');

    const hashedPassword = await bcrypt.hash('password123', 10);

    // ============================================
    // STEP 1: Create Admin
    // ============================================
    const admin = await User.create({
      name: 'TPO Admin',
      email: 'admin@cipat.com',
      password: hashedPassword,
      role: 'admin'
    });
    console.log('✓ Created admin user');

    // ============================================
    // STEP 2: Create Companies (approved = true for most)
    // ============================================
    const companyUsers = await User.insertMany([
      { name: 'HR Manager', email: 'hr@techcorp.com', password: hashedPassword, role: 'company' },
      { name: 'Recruiter', email: 'recruit@innovatech.com', password: hashedPassword, role: 'company' },
      { name: 'Talent Lead', email: 'talent@datawave.com', password: hashedPassword, role: 'company' }
    ]);

    const companies = await Company.insertMany([
      { user: companyUsers[0]._id, companyName: 'TechCorp Solutions', approved: true },
      { user: companyUsers[1]._id, companyName: 'InnovaTech Systems', approved: true },
      { user: companyUsers[2]._id, companyName: 'DataWave Analytics', approved: false }  // One pending for admin testing
    ]);
    console.log('✓ Created 3 companies (2 approved, 1 pending)');

    // ============================================
    // STEP 3: Create Students
    // ============================================
    const studentUsers = await User.insertMany([
      { name: 'Aarav Sharma', email: 'aarav@student.com', password: hashedPassword, role: 'student' },
      { name: 'Priya Patel', email: 'priya@student.com', password: hashedPassword, role: 'student' },
      { name: 'Rohan Mehta', email: 'rohan@student.com', password: hashedPassword, role: 'student' },
      { name: 'Sneha Kulkarni', email: 'sneha@student.com', password: hashedPassword, role: 'student' },
      { name: 'Vikram Singh', email: 'vikram@student.com', password: hashedPassword, role: 'student' }
    ]);

    const students = await Student.insertMany([
      { user: studentUsers[0]._id, branch: 'Computer Science', cgpa: 8.75, backlogs: 0, skills: 'React, Node.js, Python, Machine Learning, Docker' },
      { user: studentUsers[1]._id, branch: 'Information Technology', cgpa: 9.10, backlogs: 0, skills: 'Java, Spring Boot, AWS, Kubernetes, SQL' },
      { user: studentUsers[2]._id, branch: 'Electronics', cgpa: 7.20, backlogs: 1, skills: 'Embedded C, VHDL, Arduino, PCB Design, IoT' },
      { user: studentUsers[3]._id, branch: 'Computer Science', cgpa: 8.50, backlogs: 0, skills: 'Flutter, Dart, Firebase, UI/UX Design, Figma' },
      { user: studentUsers[4]._id, branch: 'Mechanical', cgpa: 6.80, backlogs: 2, skills: 'AutoCAD, SolidWorks, MATLAB, CNC Programming' }
    ]);
    console.log('✓ Created 5 students');

    // ============================================
    // STEP 4: Create Jobs (only from APPROVED companies)
    // Jobs define: minCgpa, branchRequired, maxBacklogs, deadline
    // ============================================
    const jobs = await Job.insertMany([
      // TechCorp Jobs (approved company)
      {
        company: companies[0]._id,
        title: 'Software Developer Intern',
        description: 'Join TechCorp as a Software Developer Intern. Work on cutting-edge web applications using React and Node.js. Opportunity to convert to full-time based on performance.',
        minCgpa: 7.00,
        branchRequired: 'Computer Science',
        maxBacklogs: 1,
        deadline: new Date('2026-06-30'),
        status: 'Active'
      },
      {
        company: companies[0]._id,
        title: 'Full Stack Engineer',
        description: 'Build and maintain scalable full-stack applications. Work with React, Express, PostgreSQL and AWS. Competitive salary with stock options.',
        minCgpa: 8.00,
        branchRequired: 'Computer Science',
        maxBacklogs: 0,
        deadline: new Date('2026-05-15'),
        status: 'Active'
      },
      {
        company: companies[0]._id,
        title: 'Mobile App Developer',
        description: 'Develop cross-platform mobile applications using Flutter and Dart. Work closely with the design team on UI/UX implementation.',
        minCgpa: 8.00,
        branchRequired: 'Computer Science',
        maxBacklogs: 0,
        deadline: new Date('2026-06-15'),
        status: 'Active'
      },
      // InnovaTech Jobs (approved company)
      {
        company: companies[1]._id,
        title: 'Backend Developer',
        description: 'Design and develop microservices using Java Spring Boot. Experience with cloud platforms is a plus. Remote-friendly role.',
        minCgpa: 7.50,
        branchRequired: 'Information Technology',
        maxBacklogs: 1,
        deadline: new Date('2026-07-01'),
        status: 'Active'
      },
      {
        company: companies[1]._id,
        title: 'Data Analyst Intern',
        description: 'Analyze large datasets using Python and SQL. Create dashboards with Tableau/Power BI. Great learning opportunity in the data domain.',
        minCgpa: 7.00,
        branchRequired: 'All',  // Open to all branches
        maxBacklogs: 2,
        deadline: new Date('2026-08-01'),
        status: 'Active'
      },
      {
        company: companies[1]._id,
        title: 'IoT Engineer Intern',
        description: 'Work on Industrial IoT solutions. Knowledge of embedded systems, Arduino, and sensor networks required.',
        minCgpa: 6.50,
        branchRequired: 'Electronics',
        maxBacklogs: 2,
        deadline: new Date('2026-07-15'),
        status: 'Active'
      }
    ]);
    console.log('✓ Created 6 jobs (from approved companies only)');

    // ============================================
    // STEP 5: Create Applications with CORRECT eligibility check
    // Each application MUST match the job requirements
    // ============================================
    
    // Let's verify eligibility for each application manually:
    
    // Aarav (CS, 8.75 CGPA, 0 backlogs) - Eligible for:
    // - Software Developer Intern (CS, 7.0 CGPA, 1 backlog) ✓
    // - Full Stack Engineer (CS, 8.0 CGPA, 0 backlogs) ✓
    // - Mobile App Developer (CS, 8.0 CGPA, 0 backlogs) ✓
    // - Data Analyst Intern (All, 7.0 CGPA, 2 backlogs) ✓
    
    // Priya (IT, 9.10 CGPA, 0 backlogs) - Eligible for:
    // - Backend Developer (IT, 7.5 CGPA, 1 backlog) ✓
    // - Data Analyst Intern (All, 7.0 CGPA, 2 backlogs) ✓
    
    // Rohan (Electronics, 7.20 CGPA, 1 backlog) - Eligible for:
    // - IoT Engineer Intern (Electronics, 6.5 CGPA, 2 backlogs) ✓
    // - Data Analyst Intern (All, 7.0 CGPA, 2 backlogs) ✓
    
    // Sneha (CS, 8.50 CGPA, 0 backlogs) - Eligible for:
    // - Software Developer Intern (CS, 7.0 CGPA, 1 backlog) ✓
    // - Full Stack Engineer (CS, 8.0 CGPA, 0 backlogs) ✓
    // - Mobile App Developer (CS, 8.0 CGPA, 0 backlogs) ✓
    // - Data Analyst Intern (All, 7.0 CGPA, 2 backlogs) ✓
    
    // Vikram (Mechanical, 6.80 CGPA, 2 backlogs) - Eligible for:
    // - Data Analyst Intern (All, 7.0 CGPA, 2 backlogs) ✗ (CGPA too low)
    // Note: Vikram is NOT eligible for any job - kept for showing "Not Eligible" case
    
    const applications = await Application.insertMany([
      // Aarav's applications - showing full hiring lifecycle
      { student: students[0]._id, job: jobs[0]._id, status: 'Shortlisted' },   // Software Developer - in review
      { student: students[0]._id, job: jobs[1]._id, status: 'Interview' },      // Full Stack - interview stage
      { student: students[0]._id, job: jobs[4]._id, status: 'Applied' },        // Data Analyst - just applied
      
      // Priya's applications - showing success case
      { student: students[1]._id, job: jobs[3]._id, status: 'Selected' },       // Backend Developer - HIRED!
      { student: students[1]._id, job: jobs[4]._id, status: 'Shortlisted' },    // Data Analyst - shortlisted
      
      // Rohan's applications - showing rejection case
      { student: students[2]._id, job: jobs[5]._id, status: 'Applied' },        // IoT Engineer - applied
      { student: students[2]._id, job: jobs[4]._id, status: 'Rejected' },       // Data Analyst - rejected
      
      // Sneha's applications - showing progress
      { student: students[3]._id, job: jobs[0]._id, status: 'Interview' },      // Software Developer - interview
      { student: students[3]._id, job: jobs[2]._id, status: 'Selected' },       // Mobile App - HIRED!
      
      // Vikram has no applications (not eligible for available jobs)
    ]);
    console.log('✓ Created 9 applications (with correct eligibility)');

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log('   - 1 Admin');
    console.log('   - 3 Companies (2 approved, 1 pending)');
    console.log('   - 5 Students');
    console.log('   - 6 Jobs (all from approved companies)');
    console.log('   - 9 Applications (eligibility verified)');
    console.log('\n📝 Login Credentials (password: password123):');
    console.log('   Admin: admin@cipat.com');
    console.log('   Students: aarav@student.com, priya@student.com, rohan@student.com, sneha@student.com, vikram@student.com');
    console.log('   Companies: hr@techcorp.com (approved), recruit@innovatech.com (approved), talent@datawave.com (pending)');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();
