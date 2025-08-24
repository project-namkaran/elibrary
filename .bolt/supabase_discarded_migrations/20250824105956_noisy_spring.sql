/*
  # Fix User Creation and Authentication Issues

  1. Security Updates
    - Update RLS policies to allow user creation during signup
    - Add proper policies for anonymous user registration
    - Fix foreign key constraints

  2. Triggers
    - Add trigger to automatically create user profile from auth metadata
    - Update existing triggers for better error handling
*/

-- Drop existing policies that might be blocking user creation
DROP POLICY IF EXISTS "Users can insert own data" ON users;
DROP POLICY IF EXISTS "Admins can insert users" ON users;

-- Allow users to insert their own profile during signup
CREATE POLICY "Allow user profile creation during signup"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Allow anonymous users to create profiles (needed during signup process)
CREATE POLICY "Allow anonymous user creation"
  ON users
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Ensure users can read their own data
DROP POLICY IF EXISTS "Users can read own data" ON users;
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Allow users to update their own data
DROP POLICY IF EXISTS "Users can update own data" ON users;
CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admin policies remain the same
CREATE POLICY "Admins can read all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users users_1
      WHERE users_1.id = auth.uid() AND users_1.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert users"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users users_1
      WHERE users_1.id = auth.uid() AND users_1.role = 'admin'
    )
  );

CREATE POLICY "Admins can update all users"
  ON users
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users users_1
      WHERE users_1.id = auth.uid() AND users_1.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete users"
  ON users
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users users_1
      WHERE users_1.id = auth.uid() AND users_1.role = 'admin'
    )
  );

-- Create a function to handle user creation from auth metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user profile when auth user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update the foreign key constraint to be more permissive
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_id_fkey;
ALTER TABLE users ADD CONSTRAINT users_id_fkey 
  FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Ensure the users table has proper indexes
CREATE INDEX IF NOT EXISTS idx_users_email_unique ON users (email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users (role);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.users TO anon, authenticated;
GRANT ALL ON public.user_books TO authenticated;
GRANT ALL ON public.notifications TO authenticated;