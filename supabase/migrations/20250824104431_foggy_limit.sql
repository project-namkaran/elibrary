/*
  # Add Sample Users

  1. New Users
    - Admin user with email admin@elibrary.com
    - Regular user with email user@elibrary.com
  
  2. Security
    - Both users will be inserted into the users table
    - Admin user has role 'admin'
    - Regular user has role 'user'
  
  Note: These are sample users for development/testing purposes
*/

-- Insert sample admin user
INSERT INTO users (
  id,
  name,
  email,
  role,
  avatar,
  joined_date
) VALUES (
  gen_random_uuid(),
  'Admin User',
  'admin@elibrary.com',
  'admin',
  'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
  now()
) ON CONFLICT (email) DO NOTHING;

-- Insert sample regular user
INSERT INTO users (
  id,
  name,
  email,
  role,
  avatar,
  joined_date
) VALUES (
  gen_random_uuid(),
  'John Doe',
  'user@elibrary.com',
  'user',
  'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
  now()
) ON CONFLICT (email) DO NOTHING;