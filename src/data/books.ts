import { Book } from '../types';

export const books: Book[] = [
  {
    id: '1',
    title: 'The Digital Revolution',
    author: 'Sarah Johnson',
    category: 'Technology',
    genre: 'Non-Fiction',
    cover: 'https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
    description: 'An insightful exploration of how digital technology has transformed our world and continues to shape our future.',
    rating: 4.5,
    reviews: 128,
    type: 'free',
    publishedDate: '2023-03-15',
    pages: 320,
    isbn: '978-1234567890',
    content: [
      'Chapter 1: The Dawn of Digital Age',
      'Chapter 2: Internet Revolution',
      'Chapter 3: Mobile Computing Era',
      'Chapter 4: Artificial Intelligence Rise',
      'Chapter 5: Future Perspectives'
    ]
  },
  {
    id: '2',
    title: 'Modern Web Development',
    author: 'Alex Chen',
    category: 'Technology',
    genre: 'Programming',
    cover: 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
    description: 'A comprehensive guide to building modern web applications using the latest technologies and best practices.',
    rating: 4.8,
    reviews: 245,
    type: 'paid',
    price: 29.99,
    publishedDate: '2023-06-01',
    pages: 480,
    isbn: '978-1234567891'
  },
  {
    id: '3',
    title: 'The Art of Photography',
    author: 'Maria Rodriguez',
    category: 'Arts',
    genre: 'Photography',
    cover: 'https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
    description: 'Master the fundamentals of photography and develop your unique artistic vision.',
    rating: 4.6,
    reviews: 89,
    type: 'physical',
    price: 45.00,
    isAvailable: true,
    publishedDate: '2023-01-20',
    pages: 280,
    isbn: '978-1234567892'
  },
  {
    id: '4',
    title: 'Mindful Living',
    author: 'Dr. Emily Watson',
    category: 'Health',
    genre: 'Self-Help',
    cover: 'https://images.pexels.com/photos/268533/pexels-photo-268533.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
    description: 'Discover the path to inner peace and balanced living through mindfulness practices.',
    rating: 4.7,
    reviews: 156,
    type: 'free',
    publishedDate: '2023-04-10',
    pages: 220,
    isbn: '978-1234567893',
    content: [
      'Chapter 1: Introduction to Mindfulness',
      'Chapter 2: Daily Meditation Practices',
      'Chapter 3: Mindful Breathing Techniques',
      'Chapter 4: Living in the Present',
      'Chapter 5: Building Healthy Habits'
    ]
  },
  {
    id: '5',
    title: 'Business Strategy Essentials',
    author: 'Robert Kim',
    category: 'Business',
    genre: 'Management',
    cover: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
    description: 'Learn the fundamental principles of strategic business planning and execution.',
    rating: 4.4,
    reviews: 203,
    type: 'paid',
    price: 34.99,
    publishedDate: '2023-05-15',
    pages: 350,
    isbn: '978-1234567894'
  },
  {
    id: '6',
    title: 'Climate Change Solutions',
    author: 'Dr. Lisa Green',
    category: 'Science',
    genre: 'Environmental',
    cover: 'https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
    description: 'Exploring innovative solutions to address climate change and build a sustainable future.',
    rating: 4.9,
    reviews: 78,
    type: 'free',
    publishedDate: '2023-02-28',
    pages: 290,
    isbn: '978-1234567895',
    content: [
      'Chapter 1: Understanding Climate Change',
      'Chapter 2: Renewable Energy Solutions',
      'Chapter 3: Sustainable Agriculture',
      'Chapter 4: Green Technology Innovation',
      'Chapter 5: Individual Action Steps'
    ]
  }
];

export const categories = [
  'All Categories',
  'Technology',
  'Arts',
  'Health',
  'Business',
  'Science',
  'Literature',
  'History'
];

export const genres = [
  'All Genres',
  'Fiction',
  'Non-Fiction',
  'Programming',
  'Photography',
  'Self-Help',
  'Management',
  'Environmental'
];