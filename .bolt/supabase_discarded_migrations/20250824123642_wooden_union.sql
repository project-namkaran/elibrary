/*
  # Fix infinite recursion in users table RLS policies

  1. Security Changes
    - Drop existing recursive policies that cause infinite loops
    - Add new non-recursive policies for users table
    - Ensure users can manage their own data without circular references
    - Allow admins to manage all users using auth.uid() directly

  2. Policy Changes
    - Remove policies that reference the users table within users table policies
    - Use auth.uid() and auth.jwt() for role checking instead of table lookups
    - Maintain security while avoiding recursion
*/

-- Drop all existing policies on users table
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Admins can read all users" ON users;
DROP POLICY IF EXISTS "Admins can insert users" ON users;
DROP POLICY IF EXISTS "Admins can update all users" ON users;
DROP POLICY IF EXISTS "Admins can delete users" ON users;

-- Create new non-recursive policies
-- Users can read their own data using auth.uid()
CREATE POLICY "Users can read own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Users can update their own data using auth.uid()
CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow user profile creation during signup
CREATE POLICY "Allow profile creation during signup"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Admin policies using auth metadata instead of table lookup
CREATE POLICY "Admins can read all profiles"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    (auth.jwt() ->> 'user_metadata' ->> 'role') = 'admin'
    OR 
    auth.uid() = id
  );

CREATE POLICY "Admins can update all profiles"
  ON users
  FOR UPDATE
  TO authenticated
  USING (
    (auth.jwt() ->> 'user_metadata' ->> 'role') = 'admin'
    OR 
    auth.uid() = id
  )
  WITH CHECK (
    (auth.jwt() ->> 'user_metadata' ->> 'role') = 'admin'
    OR 
    auth.uid() = id
  );

CREATE POLICY "Admins can delete profiles"
  ON users
  FOR DELETE
  TO authenticated
  USING ((auth.jwt() ->> 'user_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admins can insert profiles"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (auth.jwt() ->> 'user_metadata' ->> 'role') = 'admin'
    OR 
    auth.uid() = id
  );