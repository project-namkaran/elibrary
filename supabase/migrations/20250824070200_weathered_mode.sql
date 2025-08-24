/*
  # Seed initial books data

  1. Insert sample books from the existing data
  2. Provides initial content for the library
*/

-- Insert sample books
INSERT INTO books (
  title, author, category, genre, cover, description, rating, reviews, 
  type, price, published_date, pages, isbn, content
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
  '2023-03-15',
  320,
  '978-1234567890',
  ARRAY[
    'Chapter 1: The Dawn of Digital Age',
    'Chapter 2: Internet Revolution',
    'Chapter 3: Mobile Computing Era',
    'Chapter 4: Artificial Intelligence Rise',
    'Chapter 5: Future Perspectives'
  ]
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
  '2023-06-01',
  480,
  '978-1234567891',
  NULL
),
(
  'The Art of Photography',
  'Maria Rodriguez',
  'Arts',
  'Photography',
  'https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
  'Master the fundamentals of photography and develop your unique artistic vision.',
  4.6,
  89,
  'physical',
  45.00,
  '2023-01-20',
  280,
  '978-1234567892',
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
  '2023-04-10',
  220,
  '978-1234567893',
  ARRAY[
    'Chapter 1: Introduction to Mindfulness',
    'Chapter 2: Daily Meditation Practices',
    'Chapter 3: Mindful Breathing Techniques',
    'Chapter 4: Living in the Present',
    'Chapter 5: Building Healthy Habits'
  ]
),
(
  'Business Strategy Essentials',
  'Robert Kim',
  'Business',
  'Management',
  'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
  'Learn the fundamental principles of strategic business planning and execution.',
  4.4,
  203,
  'paid',
  34.99,
  '2023-05-15',
  350,
  '978-1234567894',
  NULL
),
(
  'Climate Change Solutions',
  'Dr. Lisa Green',
  'Science',
  'Environmental',
  'https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
  'Exploring innovative solutions to address climate change and build a sustainable future.',
  4.9,
  78,
  'free',
  NULL,
  '2023-02-28',
  290,
  '978-1234567895',
  ARRAY[
    'Chapter 1: Understanding Climate Change',
    'Chapter 2: Renewable Energy Solutions',
    'Chapter 3: Sustainable Agriculture',
    'Chapter 4: Green Technology Innovation',
    'Chapter 5: Individual Action Steps'
  ]
);