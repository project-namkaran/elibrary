import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Book } from '../types';
import { books as initialBooks } from '../data/books';

interface BookContextType {
  books: Book[];
  addBook: (book: Omit<Book, 'id'>) => void;
  updateBook: (id: string, book: Omit<Book, 'id'>) => void;
  deleteBook: (id: string) => void;
  getBookById: (id: string) => Book | undefined;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

export const BookProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>(initialBooks);

  const addBook = (bookData: Omit<Book, 'id'>) => {
    const newBook: Book = {
      ...bookData,
      id: Date.now().toString(),
      rating: 0,
      reviews: 0
    };
    
    setBooks(prev => [newBook, ...prev]);
  };

  const updateBook = (id: string, bookData: Omit<Book, 'id'>) => {
    setBooks(prev => prev.map(book => 
      book.id === id 
        ? { ...bookData, id, rating: book.rating, reviews: book.reviews }
        : book
    ));
  };

  const deleteBook = (id: string) => {
    setBooks(prev => prev.filter(book => book.id !== id));
  };

  const getBookById = (id: string) => {
    return books.find(book => book.id === id);
  };

  return (
    <BookContext.Provider
      value={{
        books,
        addBook,
        updateBook,
        deleteBook,
        getBookById
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