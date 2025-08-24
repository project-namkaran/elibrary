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
  role: 'user',
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

const mockAdmin: User = {
  id: '2',
  name: 'Admin User',
  email: 'admin@elibrary.com',
  role: 'admin',
  avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
  joinedDate: '2023-01-01',
  borrowedBooks: [],
  purchasedBooks: [],
  exchangeHistory: []
};

// Mock user database
const mockUsers = [
  mockUser,
  mockAdmin,
  {
    id: '3',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'user' as const,
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    joinedDate: '2023-02-10',
    borrowedBooks: ['3'],
    purchasedBooks: ['1'],
    exchangeHistory: []
  }
];

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
    // Mock authentication with role-based login
    if (!email || !password) {
      return false;
    }

    // Find user by email
    const foundUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (foundUser) {
      // Mock password validation (in real app, this would be hashed password comparison)
      const validPasswords = {
        'john.doe@example.com': 'user123',
        'admin@elibrary.com': 'admin123',
        'jane.smith@example.com': 'jane123'
      };
      
      const expectedPassword = validPasswords[foundUser.email as keyof typeof validPasswords];
      
      if (password === expectedPassword) {
        setUser(foundUser);
        return true;
      }
    }
    
    return false;
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    // Mock signup validation
    if (!name || !email || !password) {
      return false;
    }

    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return false;
    }

    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      role: 'user', // New users are always regular users
      joinedDate: new Date().toISOString(),
      borrowedBooks: [],
      purchasedBooks: [],
      exchangeHistory: []
    };
    
    // Add to mock database
    mockUsers.push(newUser);
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
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