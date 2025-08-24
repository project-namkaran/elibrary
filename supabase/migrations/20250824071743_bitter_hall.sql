/*
  # Allow anonymous users to insert books

  1. Security Policy
    - Add INSERT policy for anonymous users on books table
    - This allows the admin interface to add books without authentication
    
  Note: This is for development/demo purposes. In production, you should
  require proper authentication and admin role verification.
*/

-- Allow anonymous users to insert books
CREATE POLICY "Allow anonymous users to insert books"
  ON books
  FOR INSERT
  TO anon
  WITH CHECK (true);