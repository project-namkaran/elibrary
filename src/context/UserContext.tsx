import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Notification } from '../types';

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  notifications: Notification[];
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  updateReadingProgress: (bookId: string, progress: number, position: string) => void;
  markNotificationRead: (notificationId: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const mockUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
  joinedDate: '2023-01-15',
  borrowedBooks: ['1', '4'],
  purchasedBooks: ['2', '5'],
  exchangeHistory: ['3'],
  currentlyReading: {
    bookId: '1',
    progress: 45,
    lastPosition: 'Chapter 2: Internet Revolution'
  }
};

const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: '1',
    type: 'new_book',
    title: 'New Book Available',
    message: 'Climate Change Solutions has been added to the free library',
    isRead: false,
    createdDate: '2023-07-01'
  },
  {
    id: '2',
    userId: '1',
    type: 'exchange_request',
    title: 'Exchange Request',
    message: 'Someone wants to exchange with your copy of The Art of Photography',
    isRead: false,
    createdDate: '2023-06-28'
  }
];

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const isAuthenticated = user !== null;

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication
    if (email && password) {
      setUser(mockUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    // Mock signup
    if (name && email && password) {
      const newUser: User = {
        ...mockUser,
        name,
        email,
        joinedDate: new Date().toISOString(),
        borrowedBooks: [],
        purchasedBooks: [],
        exchangeHistory: []
      };
      setUser(newUser);
      return true;
    }
    return false;
  };

  const updateReadingProgress = (bookId: string, progress: number, position: string) => {
    if (user) {
      setUser({
        ...user,
        currentlyReading: {
          bookId,
          progress,
          lastPosition: position
        }
      });
    }
  };

  const markNotificationRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated,
        notifications,
        login,
        logout,
        signup,
        updateReadingProgress,
        markNotificationRead
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};