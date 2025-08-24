import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      books: {
        Row: {
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
          price: number | null;
          is_available: boolean;
          published_date: string;
          pages: number | null;
          isbn: string | null;
          content: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          author: string;
          category: string;
          genre: string;
          cover: string;
          description: string;
          rating?: number;
          reviews?: number;
          type: 'free' | 'paid' | 'physical';
          price?: number | null;
          is_available?: boolean;
          published_date: string;
          pages?: number | null;
          isbn?: string | null;
          content?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          author?: string;
          category?: string;
          genre?: string;
          cover?: string;
          description?: string;
          rating?: number;
          reviews?: number;
          type?: 'free' | 'paid' | 'physical';
          price?: number | null;
          is_available?: boolean;
          published_date?: string;
          pages?: number | null;
          isbn?: string | null;
          content?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          role: 'user' | 'admin';
          avatar: string | null;
          joined_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          email: string;
          role?: 'user' | 'admin';
          avatar?: string | null;
          joined_date?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          role?: 'user' | 'admin';
          avatar?: string | null;
          joined_date?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_books: {
        Row: {
          id: string;
          user_id: string;
          book_id: string;
          relationship_type: 'borrowed' | 'purchased' | 'wishlist' | 'exchange';
          status: 'active' | 'returned' | 'completed' | 'pending';
          progress: number;
          last_position: string | null;
          acquired_date: string;
          due_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          book_id: string;
          relationship_type: 'borrowed' | 'purchased' | 'wishlist' | 'exchange';
          status?: 'active' | 'returned' | 'completed' | 'pending';
          progress?: number;
          last_position?: string | null;
          acquired_date?: string;
          due_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          book_id?: string;
          relationship_type?: 'borrowed' | 'purchased' | 'wishlist' | 'exchange';
          status?: 'active' | 'returned' | 'completed' | 'pending';
          progress?: number;
          last_position?: string | null;
          acquired_date?: string;
          due_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: 'new_book' | 'exchange_request' | 'due_date' | 'purchase_confirm' | 'system_alert';
          title: string;
          message: string;
          is_read: boolean;
          metadata: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: 'new_book' | 'exchange_request' | 'due_date' | 'purchase_confirm' | 'system_alert';
          title: string;
          message: string;
          is_read?: boolean;
          metadata?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: 'new_book' | 'exchange_request' | 'due_date' | 'purchase_confirm' | 'system_alert';
          title?: string;
          message?: string;
          is_read?: boolean;
          metadata?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}