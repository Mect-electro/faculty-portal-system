/*
  # Add file_path column to documents table

  1. Changes
    - Add file_path column to documents table to store Firebase Storage paths
*/

ALTER TABLE documents 
ADD COLUMN IF NOT EXISTS file_path TEXT;

-- Update RLS policies to include the new column
CREATE POLICY "Faculty and Admin can insert documents with file_path" 
  ON documents FOR INSERT 
  TO authenticated 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND (profiles.role = 'Faculty' OR profiles.role = 'Admin')
    )
  );