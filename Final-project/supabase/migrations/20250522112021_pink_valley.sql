/*
  # Seed initial data
  
  1. Seed Data
    - Roles: Admin, Faculty, Student
    - Branches: Computer Science, Mechanical, Electronics
    - Classes: CS101, CS102, ME201, ME202, EC301, EC302
    - Students: 5 students per class
*/

-- Insert roles
INSERT INTO roles (name) VALUES
  ('Admin'),
  ('Faculty'),
  ('Student')
ON CONFLICT (name) DO NOTHING;

-- Insert branches
INSERT INTO branches (name) VALUES
  ('Computer Science'),
  ('Mechanical'),
  ('Electronics')
ON CONFLICT (name) DO NOTHING;

-- Get branch IDs
DO $$
DECLARE
  cs_id INT;
  me_id INT;
  ec_id INT;
BEGIN
  SELECT id INTO cs_id FROM branches WHERE name = 'Computer Science';
  SELECT id INTO me_id FROM branches WHERE name = 'Mechanical';
  SELECT id INTO ec_id FROM branches WHERE name = 'Electronics';
  
  -- Insert classes
  INSERT INTO classes (branch_id, name) VALUES
    (cs_id, 'CS101'),
    (cs_id, 'CS102'),
    (me_id, 'ME201'),
    (me_id, 'ME202'),
    (ec_id, 'EC301'),
    (ec_id, 'EC302')
  ON CONFLICT DO NOTHING;
  
  -- Insert students for CS101
  INSERT INTO students (class_id, name, email) 
  SELECT c.id, 'Alice Johnson', 'alice@uni.com'
  FROM classes c WHERE c.name = 'CS101' AND NOT EXISTS (
    SELECT 1 FROM students WHERE email = 'alice@uni.com'
  );
  
  INSERT INTO students (class_id, name, email) 
  SELECT c.id, 'Bob Smith', 'bob@uni.com'
  FROM classes c WHERE c.name = 'CS101' AND NOT EXISTS (
    SELECT 1 FROM students WHERE email = 'bob@uni.com'
  );
  
  INSERT INTO students (class_id, name, email) 
  SELECT c.id, 'Charlie Brown', 'charlie@uni.com'
  FROM classes c WHERE c.name = 'CS101' AND NOT EXISTS (
    SELECT 1 FROM students WHERE email = 'charlie@uni.com'
  );
  
  INSERT INTO students (class_id, name, email) 
  SELECT c.id, 'Diana Prince', 'diana@uni.com'
  FROM classes c WHERE c.name = 'CS101' AND NOT EXISTS (
    SELECT 1 FROM students WHERE email = 'diana@uni.com'
  );
  
  INSERT INTO students (class_id, name, email) 
  SELECT c.id, 'Ethan Hunt', 'ethan@uni.com'
  FROM classes c WHERE c.name = 'CS101' AND NOT EXISTS (
    SELECT 1 FROM students WHERE email = 'ethan@uni.com'
  );
  
  -- Insert students for CS102
  INSERT INTO students (class_id, name, email) 
  SELECT c.id, 'Fiona Gallagher', 'fiona@uni.com'
  FROM classes c WHERE c.name = 'CS102' AND NOT EXISTS (
    SELECT 1 FROM students WHERE email = 'fiona@uni.com'
  );
  
  INSERT INTO students (class_id, name, email) 
  SELECT c.id, 'George Miller', 'george@uni.com'
  FROM classes c WHERE c.name = 'CS102' AND NOT EXISTS (
    SELECT 1 FROM students WHERE email = 'george@uni.com'
  );
  
  INSERT INTO students (class_id, name, email) 
  SELECT c.id, 'Hannah Baker', 'hannah@uni.com'
  FROM classes c WHERE c.name = 'CS102' AND NOT EXISTS (
    SELECT 1 FROM students WHERE email = 'hannah@uni.com'
  );
  
  INSERT INTO students (class_id, name, email) 
  SELECT c.id, 'Ian Gallagher', 'ian@uni.com'
  FROM classes c WHERE c.name = 'CS102' AND NOT EXISTS (
    SELECT 1 FROM students WHERE email = 'ian@uni.com'
  );
  
  INSERT INTO students (class_id, name, email) 
  SELECT c.id, 'Julia Roberts', 'julia@uni.com'
  FROM classes c WHERE c.name = 'CS102' AND NOT EXISTS (
    SELECT 1 FROM students WHERE email = 'julia@uni.com'
  );
  
  -- Insert students for ME201
  INSERT INTO students (class_id, name, email) 
  SELECT c.id, 'Kevin Hart', 'kevin@uni.com'
  FROM classes c WHERE c.name = 'ME201' AND NOT EXISTS (
    SELECT 1 FROM students WHERE email = 'kevin@uni.com'
  );
  
  INSERT INTO students (class_id, name, email) 
  SELECT c.id, 'Lucy Liu', 'lucy@uni.com'
  FROM classes c WHERE c.name = 'ME201' AND NOT EXISTS (
    SELECT 1 FROM students WHERE email = 'lucy@uni.com'
  );
  
  INSERT INTO students (class_id, name, email) 
  SELECT c.id, 'Mike Ross', 'mike@uni.com'
  FROM classes c WHERE c.name = 'ME201' AND NOT EXISTS (
    SELECT 1 FROM students WHERE email = 'mike@uni.com'
  );
  
  INSERT INTO students (class_id, name, email) 
  SELECT c.id, 'Natalie Portman', 'natalie@uni.com'
  FROM classes c WHERE c.name = 'ME201' AND NOT EXISTS (
    SELECT 1 FROM students WHERE email = 'natalie@uni.com'
  );
  
  INSERT INTO students (class_id, name, email) 
  SELECT c.id, 'Oliver Queen', 'oliver@uni.com'
  FROM classes c WHERE c.name = 'ME201' AND NOT EXISTS (
    SELECT 1 FROM students WHERE email = 'oliver@uni.com'
  );
  
  -- Insert students for other classes (ME202, EC301, EC302)
  -- ME202
  INSERT INTO students (class_id, name, email) 
  SELECT c.id, 'Pam Beesly', 'pam@uni.com'
  FROM classes c WHERE c.name = 'ME202' AND NOT EXISTS (
    SELECT 1 FROM students WHERE email = 'pam@uni.com'
  );
  
  INSERT INTO students (class_id, name, email) 
  SELECT c.id, 'Quincy Jones', 'quincy@uni.com'
  FROM classes c WHERE c.name = 'ME202' AND NOT EXISTS (
    SELECT 1 FROM students WHERE email = 'quincy@uni.com'
  );
  
  INSERT INTO students (class_id, name, email) 
  SELECT c.id, 'Rachel Green', 'rachel@uni.com'
  FROM classes c WHERE c.name = 'ME202' AND NOT EXISTS (
    SELECT 1 FROM students WHERE email = 'rachel@uni.com'
  );
  
  INSERT INTO students (class_id, name, email) 
  SELECT c.id, 'Steve Rogers', 'steve@uni.com'
  FROM classes c WHERE c.name = 'ME202' AND NOT EXISTS (
    SELECT 1 FROM students WHERE email = 'steve@uni.com'
  );
  
  INSERT INTO students (class_id, name, email) 
  SELECT c.id, 'Tony Stark', 'tony@uni.com'
  FROM classes c WHERE c.name = 'ME202' AND NOT EXISTS (
    SELECT 1 FROM students WHERE email = 'tony@uni.com'
  );
  
  -- EC301
  INSERT INTO students (class_id, name, email) 
  SELECT c.id, 'Uma Thurman', 'uma@uni.com'
  FROM classes c WHERE c.name = 'EC301' AND NOT EXISTS (
    SELECT 1 FROM students WHERE email = 'uma@uni.com'
  );
  
  INSERT INTO students (class_id, name, email) 
  SELECT c.id, 'Victor Stone', 'victor@uni.com'
  FROM classes c WHERE c.name = 'EC301' AND NOT EXISTS (
    SELECT 1 FROM students WHERE email = 'victor@uni.com'
  );
  
  INSERT INTO students (class_id, name, email) 
  SELECT c.id, 'Wanda Maximoff', 'wanda@uni.com'
  FROM classes c WHERE c.name = 'EC301' AND NOT EXISTS (
    SELECT 1 FROM students WHERE email = 'wanda@uni.com'
  );
  
  INSERT INTO students (class_id, name, email) 
  SELECT c.id, 'Xavier Charles', 'xavier@uni.com'
  FROM classes c WHERE c.name = 'EC301' AND NOT EXISTS (
    SELECT 1 FROM students WHERE email = 'xavier@uni.com'
  );
  
  INSERT INTO students (class_id, name, email) 
  SELECT c.id, 'Yara Greyjoy', 'yara@uni.com'
  FROM classes c WHERE c.name = 'EC301' AND NOT EXISTS (
    SELECT 1 FROM students WHERE email = 'yara@uni.com'
  );
  
  -- EC302
  INSERT INTO students (class_id, name, email) 
  SELECT c.id, 'Zack Morris', 'zack@uni.com'
  FROM classes c WHERE c.name = 'EC302' AND NOT EXISTS (
    SELECT 1 FROM students WHERE email = 'zack@uni.com'
  );
  
  INSERT INTO students (class_id, name, email) 
  SELECT c.id, 'Amy Santiago', 'amy@uni.com'
  FROM classes c WHERE c.name = 'EC302' AND NOT EXISTS (
    SELECT 1 FROM students WHERE email = 'amy@uni.com'
  );
  
  INSERT INTO students (class_id, name, email) 
  SELECT c.id, 'Bruce Banner', 'bruce@uni.com'
  FROM classes c WHERE c.name = 'EC302' AND NOT EXISTS (
    SELECT 1 FROM students WHERE email = 'bruce@uni.com'
  );
  
  INSERT INTO students (class_id, name, email) 
  SELECT c.id, 'Clark Kent', 'clark@uni.com'
  FROM classes c WHERE c.name = 'EC302' AND NOT EXISTS (
    SELECT 1 FROM students WHERE email = 'clark@uni.com'
  );
  
  INSERT INTO students (class_id, name, email) 
  SELECT c.id, 'Donna Paulsen', 'donna@uni.com'
  FROM classes c WHERE c.name = 'EC302' AND NOT EXISTS (
    SELECT 1 FROM students WHERE email = 'donna@uni.com'
  );
  
END $$;