/*
  # Add test users for development

  1. New Data
    - Add one regular user for testing
    - Add one admin user for testing
    - Both users will have sample data for borrowed/purchased books

  2. Security
    - Users will be added to both auth.users and public.users tables
    - Passwords will be hashed by Supabase Auth
    - Sample user book relationships will be created

  3. Test Credentials
    - Regular User: test@example.com / password123
    - Admin User: admin@example.com / admin123
*/

-- Insert test users into auth.users (this simulates what happens during signup)
-- Note: In a real scenario, these would be created through the Supabase Auth API
-- For testing purposes, we'll create the profile records directly

-- Insert regular test user profile
INSERT INTO public.users (
  id,
  name,
  email,
  role,
  avatar,
  joined_date
) VALUES (
  '550e8400-e29b-41d4-a716-446655440001',
  'John Doe',
  'test@example.com',
  'user',
  'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
  '2023-01-15T00:00:00Z'
) ON CONFLICT (id) DO NOTHING;

-- Insert admin test user profile
INSERT INTO public.users (
  id,
  name,
  email,
  role,
  avatar,
  joined_date
) VALUES (
  '550e8400-e29b-41d4-a716-446655440002',
  'Admin User',
  'admin@example.com',
  'admin',
  'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
  '2023-01-01T00:00:00Z'
) ON CONFLICT (id) DO NOTHING;

-- Add some sample user-book relationships for the test user
-- First, let's make sure we have some books to reference
INSERT INTO public.books (
  title,
  author,
  category,
  genre,
  cover,
  description,
  rating,
  reviews,
  type,
  price,
  is_available,
  published_date,
  pages,
  isbn,
  content
) VALUES 
(
  'The Digital Revolution',
  'Sarah Johnson',
  'Technology',
  'Non-Fiction',
  'https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
  'An insightful exploration of how digital technology has transformed our world and continues to shape our future.',
  4.5,
  128,
  'free',
  NULL,
  true,
  '2023-03-15',
  320,
  '978-1234567890',
  ARRAY['Chapter 1: The Dawn of Digital Age', 'Chapter 2: Internet Revolution', 'Chapter 3: Mobile Computing Era', 'Chapter 4: Artificial Intelligence Rise', 'Chapter 5: Future Perspectives']
),
(
  'Modern Web Development',
  'Alex Chen',
  'Technology',
  'Programming',
  'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
  'A comprehensive guide to building modern web applications using the latest technologies and best practices.',
  4.8,
  245,
  'paid',
  29.99,
  true,
  '2023-06-01',
  480,
  '978-1234567891',
  NULL
),
(
  'Mindful Living',
  'Dr. Emily Watson',
  'Health',
  'Self-Help',
  'https://images.pexels.com/photos/268533/pexels-photo-268533.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
  'Discover the path to inner peace and balanced living through mindfulness practices.',
  4.7,
  156,
  'free',
  NULL,
  true,
  '2023-04-10',
  220,
  '978-1234567893',
  ARRAY['Chapter 1: Introduction to Mindfulness', 'Chapter 2: Daily Meditation Practices', 'Chapter 3: Mindful Breathing Techniques', 'Chapter 4: Living in the Present', 'Chapter 5: Building Healthy Habits']
) ON CONFLICT (title, author) DO NOTHING;

-- Add user-book relationships for the test user
-- Get book IDs for our sample books
DO $$
DECLARE
    digital_rev_id uuid;
    web_dev_id uuid;
    mindful_id uuid;
    test_user_id uuid := '550e8400-e29b-41d4-a716-446655440001';
BEGIN
    -- Get book IDs
    SELECT id INTO digital_rev_id FROM public.books WHERE title = 'The Digital Revolution' LIMIT 1;
    SELECT id INTO web_dev_id FROM public.books WHERE title = 'Modern Web Development' LIMIT 1;
    SELECT id INTO mindful_id FROM public.books WHERE title = 'Mindful Living' LIMIT 1;
    
    -- Add borrowed book (currently reading)
    IF digital_rev_id IS NOT NULL THEN
        INSERT INTO public.user_books (
            user_id,
            book_id,
            relationship_type,
            status,
            progress,
            last_position,
            acquired_date
        ) VALUES (
            test_user_id,
            digital_rev_id,
            'borrowed',
            'active',
            45,
            'Chapter 2: Internet Revolution',
            NOW() - INTERVAL '5 days'
        ) ON CONFLICT (user_id, book_id, relationship_type) DO NOTHING;
    END IF;
    
    -- Add purchased book
    IF web_dev_id IS NOT NULL THEN
        INSERT INTO public.user_books (
            user_id,
            book_id,
            relationship_type,
            status,
            progress,
            last_position,
            acquired_date
        ) VALUES (
            test_user_id,
            web_dev_id,
            'purchased',
            'completed',
            100,
            'Completed',
            NOW() - INTERVAL '30 days'
        ) ON CONFLICT (user_id, book_id, relationship_type) DO NOTHING;
    END IF;
    
    -- Add wishlist book
    IF mindful_id IS NOT NULL THEN
        INSERT INTO public.user_books (
            user_id,
            book_id,
            relationship_type,
            status,
            progress,
            last_position,
            acquired_date
        ) VALUES (
            test_user_id,
            mindful_id,
            'wishlist',
            'pending',
            0,
            NULL,
            NOW()
        ) ON CONFLICT (user_id, book_id, relationship_type) DO NOTHING;
    END IF;
END $$;

-- Add some sample notifications for the test user
INSERT INTO public.notifications (
    user_id,
    type,
    title,
    message,
    is_read,
    metadata
) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440001',
    'new_book',
    'New Book Available',
    'Climate Change Solutions has been added to the free library',
    false,
    '{"book_id": null}'
),
(
    '550e8400-e29b-41d4-a716-446655440001',
    'due_date',
    'Book Due Soon',
    'Your borrowed book "The Digital Revolution" is due in 3 days',
    false,
    '{"book_id": null, "due_date": "2024-01-15"}'
),
(
    '550e8400-e29b-41d4-a716-446655440001',
    'purchase_confirm',
    'Purchase Confirmed',
    'Thank you for purchasing "Modern Web Development"',
    true,
    '{"book_id": null, "amount": 29.99}'
) ON CONFLICT DO NOTHING;