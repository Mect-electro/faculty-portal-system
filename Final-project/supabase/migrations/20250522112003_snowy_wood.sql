/*
  # Initial database schema setup

  1. New Tables
    - `roles` - Stores user role types (Admin, Faculty, Student)
    - `branches` - Academic branches (CS, ME, EC)
    - `classes` - Classes within branches
    - `students` - Student information for each class
    - `documents` - Document files uploaded by users
    - `events` - Calendar events for classes
    - `profiles` - User profiles with role information
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL -- Admin, Faculty, Student
);

-- Create branches table
CREATE TABLE IF NOT EXISTS branches (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL -- CS, ME, EC, etc.
);

-- Create classes table
CREATE TABLE IF NOT EXISTS classes (
  id SERIAL PRIMARY KEY,
  branch_id INT REFERENCES branches(id),
  name TEXT NOT NULL -- e.g. CS101
);

-- Create students table
CREATE TABLE IF NOT EXISTS students (
  id SERIAL PRIMARY KEY,
  class_id INT REFERENCES classes(id),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL
);

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id SERIAL PRIMARY KEY,
  class_id INT REFERENCES classes(id),
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  uploaded_by UUID REFERENCES auth.users(id),
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  class_id INT REFERENCES classes(id),
  title TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  description TEXT
);

-- Create profiles table to store user roles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  role TEXT NOT NULL DEFAULT 'Student' -- Default to Student role
);

-- Enable row level security
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Roles: all authenticated users can read
CREATE POLICY "Anyone can read roles" 
  ON roles FOR SELECT 
  TO authenticated 
  USING (true);

-- Branches: all authenticated users can read
CREATE POLICY "Anyone can read branches" 
  ON branches FOR SELECT 
  TO authenticated 
  USING (true);

-- Classes: all authenticated users can read
CREATE POLICY "Anyone can read classes" 
  ON classes FOR SELECT 
  TO authenticated 
  USING (true);

-- Students: all authenticated users can read
CREATE POLICY "Anyone can read students" 
  ON students FOR SELECT 
  TO authenticated 
  USING (true);

-- Documents: all authenticated users can read, only faculty/admin can insert/delete
CREATE POLICY "Anyone can read documents" 
  ON documents FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Faculty and Admin can insert documents" 
  ON documents FOR INSERT 
  TO authenticated 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND (profiles.role = 'Faculty' OR profiles.role = 'Admin')
    )
  );

CREATE POLICY "Faculty and Admin can delete documents" 
  ON documents FOR DELETE 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND (profiles.role = 'Faculty' OR profiles.role = 'Admin')
    )
  );

-- Events: all authenticated users can read, only faculty/admin can insert/update/delete
CREATE POLICY "Anyone can read events" 
  ON events FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Faculty and Admin can insert events" 
  ON events FOR INSERT 
  TO authenticated 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND (profiles.role = 'Faculty' OR profiles.role = 'Admin')
    )
  );

CREATE POLICY "Faculty and Admin can delete events" 
  ON events FOR DELETE 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND (profiles.role = 'Faculty' OR profiles.role = 'Admin')
    )
  );

-- Profiles: users can read all profiles, but only update their own
CREATE POLICY "Anyone can read profiles" 
  ON profiles FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Users can update their own profile" 
  ON profiles FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = id);

-- Admin can insert/delete students
CREATE POLICY "Faculty and Admin can insert students" 
  ON students FOR INSERT 
  TO authenticated 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND (profiles.role = 'Faculty' OR profiles.role = 'Admin')
    )
  );

CREATE POLICY "Faculty and Admin can delete students" 
  ON students FOR DELETE 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND (profiles.role = 'Faculty' OR profiles.role = 'Admin')
    )
  );