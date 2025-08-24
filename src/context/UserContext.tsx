import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Notification } from '../types';
import { supabase } from '../lib/supabase';

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

  // Listen for auth state changes and load user profile
  useEffect(() => {
    const loadUserProfile = async (userId: string) => {
      try {
        // Get user profile from users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();

        if (userError || !userData) {
          console.error('User data error:', userError);
          return;
        }

        // Get user's book relationships
        const { data: userBooks, error: booksError } = await supabase
          .from('user_books')
          .select('*')
          .eq('user_id', userId);

        if (booksError) {
          console.error('User books error:', booksError);
        }

        // Get user's notifications
        const { data: userNotifications, error: notificationsError } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (notificationsError) {
          console.error('Notifications error:', notificationsError);
        }

        const userProfile = dbUserToUser(userData, userBooks || []);
        setUser(userProfile);

        // Convert database notifications to app format
        if (userNotifications) {
          const appNotifications: Notification[] = userNotifications.map(n => ({
            id: n.id,
            userId: n.user_id,
            type: n.type,
            title: n.title,
            message: n.message,
            isRead: n.is_read,
            createdDate: n.created_at
          }));
          setNotifications(appNotifications);
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
      }
    };

    // Check current session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await loadUserProfile(session.user.id);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT') {
          setUser(null);
          setNotifications([]);
        } else if (event === 'SIGNED_IN' && session?.user) {
          await loadUserProfile(session.user.id);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Helper function to convert database user to User type
  const dbUserToUser = (dbUser: any, userBooks: any[]): User => {
    const borrowedBooks = userBooks
      .filter(ub => ub.relationship_type === 'borrowed')
      .map(ub => ub.book_id);
    
    const purchasedBooks = userBooks
      .filter(ub => ub.relationship_type === 'purchased')
      .map(ub => ub.book_id);
    
    const exchangeHistory = userBooks
      .filter(ub => ub.relationship_type === 'exchange')
      .map(ub => ub.book_id);

    // Find currently reading book
    const currentlyReadingBook = userBooks.find(
      ub => ub.relationship_type === 'borrowed' && ub.progress > 0 && ub.progress < 100
    );

    return {
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      role: dbUser.role,
      avatar: dbUser.avatar,
      joinedDate: dbUser.joined_date,
      borrowedBooks,
      purchasedBooks,
      exchangeHistory,
      currentlyReading: currentlyReadingBook ? {
        bookId: currentlyReadingBook.book_id,
        progress: currentlyReadingBook.progress || 0,
        lastPosition: currentlyReadingBook.last_position || 'Beginning'
      } : undefined
    };
  };
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      if (!email || !password) {
        return false;
      }

      // Sign in with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password: password
      });

      if (authError || !authData.user) {
        console.error('Auth error:', authError);
        return false;
      }

      // Get user profile from users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (userError || !userData) {
        console.error('User data error:', userError);
        await supabase.auth.signOut();
        return false;
      }

      // Get user's book relationships
      const { data: userBooks, error: booksError } = await supabase
        .from('user_books')
        .select('*')
        .eq('user_id', authData.user.id);

      if (booksError) {
        console.error('User books error:', booksError);
        // Continue without book data
      }

      const userProfile = dbUserToUser(userData, userBooks || []);
      setUser(userProfile);
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      if (!name || !email || !password) {
        throw new Error('Please fill in all required fields.');
      }

      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.toLowerCase(),
        password: password
      });

      if (authError || !authData.user) {
        if (authError?.message === 'User already registered') {
          throw new Error('An account with this email already exists. Please sign in instead.');
        }
        throw new Error('Account creation failed. Please try again.');
      }

      // Create user profile in users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user.id,
            name: name.trim(),
            email: email.toLowerCase(),
            role: 'user'
          }
        ])
        .select()
        .single();

      if (userError || !userData) {
        // Clean up auth user if profile creation failed
        await supabase.auth.signOut();
        throw new Error('Failed to create user profile. Please try again.');
      }

      const userProfile = dbUserToUser(userData, []);
      setUser(userProfile);
      
      return true;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  const updateReadingProgress = async (bookId: string, progress: number, position: string) => {
    if (!user) return;

    try {
      // Update or insert user_books record
      const { error } = await supabase
        .from('user_books')
        .upsert({
          user_id: user.id,
          book_id: bookId,
          relationship_type: 'borrowed',
          progress: Math.round(progress),
          last_position: position,
          status: progress >= 100 ? 'completed' : 'active'
        });

      if (error) {
        console.error('Error updating reading progress:', error);
        return;
      }

      // Update local user state
      setUser({
        ...user,
        currentlyReading: {
          bookId,
          progress,
          lastPosition: position
        }
      });
    } catch (error) {
      console.error('Error updating reading progress:', error);
    }
  };

  const markNotificationRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) {
        console.error('Error marking notification as read:', error);
        return;
      }

      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
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