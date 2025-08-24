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
    };
  };
}