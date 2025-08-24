import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Book } from '../types';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type BookRow = Database['public']['Tables']['books']['Row'];
type BookInsert = Database['public']['Tables']['books']['Insert'];
type BookUpdate = Database['public']['Tables']['books']['Update'];

interface BookContextType {
  books: Book[];
  loading: boolean;
  error: string | null;
  addBook: (book: Omit<Book, 'id'>) => Promise<boolean>;
  updateBook: (id: string, book: Omit<Book, 'id'>) => Promise<boolean>;
  deleteBook: (id: string) => Promise<boolean>;
  getBookById: (id: string) => Book | undefined;
  refreshBooks: () => Promise<void>;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

// Helper function to convert database row to Book type
const dbRowToBook = (row: BookRow): Book => ({
  id: row.id,
  title: row.title,
  author: row.author,
  category: row.category,
  genre: row.genre,
  cover: row.cover,
  description: row.description,
  rating: row.rating,
  reviews: row.reviews,
  type: row.type,
  price: row.price || undefined,
  isAvailable: row.is_available,
  publishedDate: row.published_date,
  pages: row.pages || undefined,
  isbn: row.isbn || undefined,
  content: row.content || undefined
});

// Helper function to convert Book type to database insert/update
const bookToDbInsert = (book: Omit<Book, 'id'>): BookInsert => ({
  title: book.title,
  author: book.author,
  category: book.category,
  genre: book.genre,
  cover: book.cover,
  description: book.description,
  rating: book.rating || 0,
  reviews: book.reviews || 0,
  type: book.type,
  price: book.price || null,
  is_available: book.isAvailable ?? true,
  published_date: book.publishedDate,
  pages: book.pages || null,
  isbn: book.isbn || null,
  content: book.content || null
});

const bookToDbUpdate = (book: Omit<Book, 'id'>): BookUpdate => ({
  title: book.title,
  author: book.author,
  category: book.category,
  genre: book.genre,
  cover: book.cover,
  description: book.description,
  rating: book.rating || 0,
  reviews: book.reviews || 0,
  type: book.type,
  price: book.price || null,
  is_available: book.isAvailable ?? true,
  published_date: book.publishedDate,
  pages: book.pages || null,
  isbn: book.isbn || null,
  content: book.content || null
});

export const BookProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch books from Supabase
  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      const booksData = data?.map(dbRowToBook) || [];
      setBooks(booksData);
    } catch (err) {
      console.error('Error fetching books:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch books');
    } finally {
      setLoading(false);
    }
  };

  // Load books on component mount
  useEffect(() => {
    fetchBooks();
  }, []);

  const addBook = async (bookData: Omit<Book, 'id'>): Promise<boolean> => {
    try {
      setError(null);
      
      const dbBook = bookToDbInsert(bookData);
      
      const { data, error: insertError } = await supabase
        .from('books')
        .insert([dbBook])
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      if (data) {
        const newBook = dbRowToBook(data);
        setBooks(prev => [newBook, ...prev]);
        return true;
      }

      return false;
    } catch (err) {
      console.error('Error adding book:', err);
      setError(err instanceof Error ? err.message : 'Failed to add book');
      return false;
    }
  };

  const updateBook = async (id: string, bookData: Omit<Book, 'id'>): Promise<boolean> => {
    try {
      setError(null);
      
      const dbBook = bookToDbUpdate(bookData);
      
      const { data, error: updateError } = await supabase
        .from('books')
        .update(dbBook)
        .eq('id', id)
        .select();

      if (updateError) {
        throw updateError;
      }

      if (data && data.length > 0) {
        const updatedBook = dbRowToBook(data[0]);
        setBooks(prev => prev.map(book => 
          book.id === id ? updatedBook : book
        ));
        return true;
      } else {
        setError('Book not found or could not be updated');
        return false;
      }

    } catch (err) {
      console.error('Error updating book:', err);
      setError(err instanceof Error ? err.message : 'Failed to update book');
      return false;
    }
  };

  const deleteBook = async (id: string): Promise<boolean> => {
    try {
      setError(null);
      
      const { error: deleteError } = await supabase
        .from('books')
        .delete()
        .eq('id', id);

      if (deleteError) {
        throw deleteError;
      }

      setBooks(prev => prev.filter(book => book.id !== id));
      return true;
    } catch (err) {
      console.error('Error deleting book:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete book');
      return false;
    }
  };

  const getBookById = (id: string): Book | undefined => {
    return books.find(book => book.id === id);
  };

  const refreshBooks = async (): Promise<void> => {
    await fetchBooks();
  };

  return (
    <BookContext.Provider
      value={{
        books,
        loading,
        error,
        addBook,
        updateBook,
        deleteBook,
        getBookById,
        refreshBooks
      }}
    >
      {children}
    </BookContext.Provider>
  );
};

export const useBooks = () => {
  const context = useContext(BookContext);
  if (context === undefined) {
    throw new Error('useBooks must be used within a BookProvider');
  }
  return context;
};