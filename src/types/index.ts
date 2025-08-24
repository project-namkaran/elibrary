export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  joinedDate: string;
  borrowedBooks: string[];
  purchasedBooks: string[];
  exchangeHistory: string[];
  currentlyReading?: {
    bookId: string;
    progress: number;
    lastPosition: string;
  };
}

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  genre: string;
  cover: string;
  description: string;
  rating: number;
  reviews: number;
  type: 'free' | 'paid' | 'physical';
  price?: number;
  isAvailable?: boolean; // This maps to is_available in database
  publishedDate: string;
  pages?: number;
  isbn?: string;
  content?: string[];
}

export interface ExchangeOffer {
  id: string;
  userId: string;
  bookId: string;
  condition: 'excellent' | 'good' | 'fair';
  description: string;
  wantedBooks: string[];
  location: string;
  createdDate: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'new_book' | 'exchange_request' | 'due_date' | 'purchase_confirm';
  title: string;
  message: string;
  isRead: boolean;
  createdDate: string;
}