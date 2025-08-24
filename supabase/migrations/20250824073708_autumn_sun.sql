/*
  # Fix infinite recursion in users table RLS policies

  1. Problem
    - Current RLS policies on users table create infinite recursion
    - Policies query the users table from within policies applied to the same table
    - This happens when checking if a user has admin role

  2. Solution
    - Drop existing problematic policies
    - Create new policies that use auth.users metadata instead of querying users table
    - Use auth.jwt() to check user role from JWT claims
    - Simplify policies to avoid self-referencing queries

  3. Changes
    - Remove policies that query users table recursively
    - Add new policies using auth metadata
    - Ensure users can still manage their own data
    - Allow admins to manage all users without recursion
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admins can insert users" ON users;
DROP POLICY IF EXISTS "Admins can read all users" ON users;
DROP POLICY IF EXISTS "Admins can update all users" ON users;
DROP POLICY IF EXISTS "Admins can delete users" ON users;
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;

-- Create new policies that avoid recursion
-- Users can read their own data
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Users can update their own data (except role)
CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = OLD.role);

-- Allow user creation during signup (system level)
CREATE POLICY "Allow user creation during signup"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Admin policies using auth metadata (avoiding recursion)
-- Note: These policies check the raw_user_meta_data from auth.users
-- which is set during user creation and doesn't require querying the users table

CREATE POLICY "Service role can manage all users"
  ON users
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow reading user data for admin operations
-- This policy allows admins to read user data without recursion
CREATE POLICY "Admins can read all users via auth metadata"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    (auth.jwt() ->> 'role') = 'admin' OR
    auth.uid() = id
  );

-- Allow admins to update users via auth metadata
CREATE POLICY "Admins can update all users via auth metadata"
  ON users
  FOR UPDATE
  TO authenticated
  USING ((auth.jwt() ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() ->> 'role') = 'admin');

-- Allow admins to delete users via auth metadata
CREATE POLICY "Admins can delete users via auth metadata"
  ON users
  FOR DELETE
  TO authenticated
  USING ((auth.jwt() ->> 'role') = 'admin');

-- Allow admins to insert users via auth metadata
CREATE POLICY "Admins can insert users via auth metadata"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt() ->> 'role') = 'admin');