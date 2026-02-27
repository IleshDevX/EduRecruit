-- CIPAT Database Schema for Supabase PostgreSQL
-- Run this SQL in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'company', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Students table
CREATE TABLE IF NOT EXISTS students (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  branch VARCHAR(100) DEFAULT '',
  cgpa DECIMAL(3,2) DEFAULT 0.00,
  backlogs INTEGER DEFAULT 0,
  skills TEXT DEFAULT '',
  resume_url TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Companies table
CREATE TABLE IF NOT EXISTS companies (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  company_name VARCHAR(255) NOT NULL,
  approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  company_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  min_cgpa DECIMAL(3,2) DEFAULT 0.00,
  branch_required VARCHAR(100) DEFAULT 'All',
  max_backlogs INTEGER DEFAULT 0,
  deadline DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Applications table
CREATE TABLE IF NOT EXISTS applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'Applied' CHECK (status IN ('Applied', 'Shortlisted', 'Interview', 'Selected', 'Rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, job_id)
);

-- Create a default admin user (password: password123)
INSERT INTO users (id, name, email, password, role) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'TPO Admin', 'admin@cipat.com', '$2b$10$agduexy.Tou2QmU4c42hYeagjo3Lr5tTm3rRK9TIwQ1n2ZyaiZ8Ni', 'admin')
ON CONFLICT (email) DO NOTHING;

-- =============================================
-- SEED DATA: Students (password: password123)
-- =============================================
INSERT INTO users (id, name, email, password, role) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'Aarav Sharma', 'aarav@student.com', '$2b$10$agduexy.Tou2QmU4c42hYeagjo3Lr5tTm3rRK9TIwQ1n2ZyaiZ8Ni', 'student'),
  ('b0000000-0000-0000-0000-000000000002', 'Priya Patel', 'priya@student.com', '$2b$10$agduexy.Tou2QmU4c42hYeagjo3Lr5tTm3rRK9TIwQ1n2ZyaiZ8Ni', 'student'),
  ('b0000000-0000-0000-0000-000000000003', 'Rohan Mehta', 'rohan@student.com', '$2b$10$agduexy.Tou2QmU4c42hYeagjo3Lr5tTm3rRK9TIwQ1n2ZyaiZ8Ni', 'student'),
  ('b0000000-0000-0000-0000-000000000004', 'Sneha Kulkarni', 'sneha@student.com', '$2b$10$agduexy.Tou2QmU4c42hYeagjo3Lr5tTm3rRK9TIwQ1n2ZyaiZ8Ni', 'student'),
  ('b0000000-0000-0000-0000-000000000005', 'Vikram Singh', 'vikram@student.com', '$2b$10$agduexy.Tou2QmU4c42hYeagjo3Lr5tTm3rRK9TIwQ1n2ZyaiZ8Ni', 'student')
ON CONFLICT (email) DO NOTHING;

INSERT INTO students (user_id, branch, cgpa, backlogs, skills, resume_url) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'Computer Science', 8.75, 0, 'React, Node.js, Python, Machine Learning, Docker', ''),
  ('b0000000-0000-0000-0000-000000000002', 'Information Technology', 9.10, 0, 'Java, Spring Boot, AWS, Kubernetes, SQL', ''),
  ('b0000000-0000-0000-0000-000000000003', 'Electronics', 7.20, 1, 'Embedded C, VHDL, Arduino, PCB Design, IoT', ''),
  ('b0000000-0000-0000-0000-000000000004', 'Computer Science', 8.50, 0, 'Flutter, Dart, Firebase, UI/UX Design, Figma', ''),
  ('b0000000-0000-0000-0000-000000000005', 'Mechanical', 6.80, 2, 'AutoCAD, SolidWorks, MATLAB, CNC Programming', '')
ON CONFLICT (user_id) DO NOTHING;

-- =============================================
-- SEED DATA: Companies (password: password123)
-- =============================================
INSERT INTO users (id, name, email, password, role) VALUES
  ('c0000000-0000-0000-0000-000000000001', 'HR Manager', 'hr@techcorp.com', '$2b$10$agduexy.Tou2QmU4c42hYeagjo3Lr5tTm3rRK9TIwQ1n2ZyaiZ8Ni', 'company'),
  ('c0000000-0000-0000-0000-000000000002', 'Recruiter', 'recruit@innovatech.com', '$2b$10$agduexy.Tou2QmU4c42hYeagjo3Lr5tTm3rRK9TIwQ1n2ZyaiZ8Ni', 'company'),
  ('c0000000-0000-0000-0000-000000000003', 'Talent Lead', 'talent@datawave.com', '$2b$10$agduexy.Tou2QmU4c42hYeagjo3Lr5tTm3rRK9TIwQ1n2ZyaiZ8Ni', 'company')
ON CONFLICT (email) DO NOTHING;

INSERT INTO companies (user_id, company_name, approved) VALUES
  ('c0000000-0000-0000-0000-000000000001', 'TechCorp Solutions', true),
  ('c0000000-0000-0000-0000-000000000002', 'InnovaTech Systems', true),
  ('c0000000-0000-0000-0000-000000000003', 'DataWave Analytics', false)
ON CONFLICT (user_id) DO NOTHING;

-- =============================================
-- SEED DATA: Jobs
-- =============================================
INSERT INTO jobs (id, company_id, title, description, min_cgpa, branch_required, max_backlogs, deadline) VALUES
  ('d0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'Software Developer Intern',
   'Join TechCorp as a Software Developer Intern. Work on cutting-edge web applications using React and Node.js. Opportunity to convert to full-time based on performance.',
   7.00, 'Computer Science', 1, '2026-06-30'),

  ('d0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', 'Full Stack Engineer',
   'Build and maintain scalable full-stack applications. Work with React, Express, PostgreSQL and AWS. Competitive salary with stock options.',
   8.00, 'Computer Science', 0, '2026-05-15'),

  ('d0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000002', 'Backend Developer',
   'Design and develop microservices using Java Spring Boot. Experience with cloud platforms is a plus. Remote-friendly role.',
   7.50, 'Information Technology', 1, '2026-07-01'),

  ('d0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000002', 'Data Analyst Intern',
   'Analyze large datasets using Python and SQL. Create dashboards with Tableau/Power BI. Great learning opportunity in the data domain.',
   7.00, 'All', 2, '2026-08-01'),

  ('d0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000001', 'Mobile App Developer',
   'Develop cross-platform mobile applications using Flutter and Dart. Work closely with the design team on UI/UX implementation.',
   8.00, 'Computer Science', 0, '2026-06-15'),

  ('d0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000002', 'IoT Engineer Intern',
   'Work on Industrial IoT solutions. Knowledge of embedded systems, Arduino, and sensor networks required.',
   6.50, 'Electronics', 2, '2026-07-15')
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- SEED DATA: Applications (visible status data)
-- =============================================
INSERT INTO applications (student_id, job_id, status) VALUES
  -- Aarav applied to multiple jobs
  ('b0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'Shortlisted'),
  ('b0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000002', 'Interview'),
  ('b0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000004', 'Applied'),
  -- Priya
  ('b0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000003', 'Selected'),
  ('b0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000004', 'Shortlisted'),
  -- Rohan
  ('b0000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000006', 'Applied'),
  ('b0000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000004', 'Rejected'),
  -- Sneha
  ('b0000000-0000-0000-0000-000000000004', 'd0000000-0000-0000-0000-000000000001', 'Interview'),
  ('b0000000-0000-0000-0000-000000000004', 'd0000000-0000-0000-0000-000000000005', 'Selected'),
  -- Vikram
  ('b0000000-0000-0000-0000-000000000005', 'd0000000-0000-0000-0000-000000000004', 'Applied')
ON CONFLICT (student_id, job_id) DO NOTHING;

-- Row Level Security Policies (optional, recommended for Supabase)
-- Disable RLS for server-side operations with service key
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Allow service role full access
CREATE POLICY "Service role access" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role access" ON students FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role access" ON companies FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role access" ON jobs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role access" ON applications FOR ALL USING (true) WITH CHECK (true);

-- Create storage bucket for resumes
-- Run this separately or via Supabase dashboard:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', true);
