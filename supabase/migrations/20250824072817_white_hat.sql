/*
  # Add Initial Users for Testing

  1. New Users
    - Creates initial admin and user accounts for testing
    - Admin: admin@elibrary.com
    - User: john.doe@example.com
  
  2. Security
    - Uses Supabase Auth for password management
    - Links users table to auth.users
  
  3. Sample Data
    - Adds some sample user-book relationships
    - Creates initial notifications
*/

-- Insert initial users (these will be linked to auth.users when they sign up)
-- Note: The actual auth users need to be created through the Supabase Auth system
-- This just creates the profile records that will be linked when users sign up

-- First, let's create some sample auth users (this is typically done through the Auth API)
-- For now, we'll just create the profile records

INSERT INTO users (id, name, email, role, avatar, joined_date) VALUES
  ('550e8400-e29b-41d4-a716-446655440000', 'Admin User', 'admin@elibrary.com', 'admin', 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop', '2023-01-01T00:00:00Z'),
  ('550e8400-e29b-41d4-a716-446655440001', 'John Doe', 'john.doe@example.com', 'user', 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop', '2023-01-15T00:00:00Z'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Jane Smith', 'jane.smith@example.com', 'user', 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop', '2023-02-10T00:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- Add some sample user-book relationships
INSERT INTO user_books (user_id, book_id, relationship_type, status, progress, last_position) 
SELECT 
  '550e8400-e29b-41d4-a716-446655440001' as user_id,
  b.id as book_id,
  'borrowed' as relationship_type,
  CASE 
    WHEN b.title = 'The Digital Revolution' THEN 'active'
    ELSE 'completed'
  END as status,
  CASE 
    WHEN b.title = 'The Digital Revolution' THEN 45
    ELSE 100
  END as progress,
  CASE 
    WHEN b.title = 'The Digital Revolution' THEN 'Chapter 2: Internet Revolution'
    ELSE 'Completed'
  END as last_position
FROM books b 
WHERE b.title IN ('The Digital Revolution', 'Mindful Living')
ON CONFLICT (user_id, book_id, relationship_type) DO NOTHING;

-- Add some purchased books
INSERT INTO user_books (user_id, book_id, relationship_type, status, progress) 
SELECT 
  '550e8400-e29b-41d4-a716-446655440001' as user_id,
  b.id as book_id,
  'purchased' as relationship_type,
  'active' as status,
  0 as progress
FROM books b 
WHERE b.type = 'paid'
LIMIT 2
ON CONFLICT (user_id, book_id, relationship_type) DO NOTHING;

-- Add some notifications
INSERT INTO notifications (user_id, type, title, message, is_read) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'new_book', 'New Book Available', 'Climate Change Solutions has been added to the free library', false),
  ('550e8400-e29b-41d4-a716-446655440001', 'exchange_request', 'Exchange Request', 'Someone wants to exchange with your copy of The Art of Photography', false),
  ('550e8400-e29b-41d4-a716-446655440002', 'new_book', 'Welcome!', 'Welcome to E-Library! Start exploring our collection.', false)
ON CONFLICT (id) DO NOTHING;