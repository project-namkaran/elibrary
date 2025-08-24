/*
  # Create books database schema

  1. New Tables
    - `books`
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `author` (text, not null)
      - `category` (text, not null)
      - `genre` (text, not null)
      - `cover` (text, not null)
      - `description` (text, not null)
      - `rating` (numeric, default 0)
      - `reviews` (integer, default 0)
      - `type` (text, not null, check constraint)
      - `price` (numeric, nullable)
      - `is_available` (boolean, default true)
      - `published_date` (date, not null)
      - `pages` (integer, nullable)
      - `isbn` (text, nullable)
      - `content` (text[], nullable - array of chapter titles)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `books` table
    - Add policies for public read access
    - Add policies for authenticated admin users to manage books

  3. Indexes
    - Add indexes for common query patterns
*/

-- Create books table
CREATE TABLE IF NOT EXISTS books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  author text NOT NULL,
  category text NOT NULL,
  genre text NOT NULL,
  cover text NOT NULL,
  description text NOT NULL,
  rating numeric DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  reviews integer DEFAULT 0 CHECK (reviews >= 0),
  type text NOT NULL CHECK (type IN ('free', 'paid', 'physical')),
  price numeric CHECK (price >= 0),
  is_available boolean DEFAULT true,
  published_date date NOT NULL,
  pages integer CHECK (pages > 0),
  isbn text,
  content text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE books ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow everyone to read books
CREATE POLICY "Books are viewable by everyone"
  ON books
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated admin users to insert books
CREATE POLICY "Admin users can insert books"
  ON books
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Allow authenticated admin users to update books
CREATE POLICY "Admin users can update books"
  ON books
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Allow authenticated admin users to delete books
CREATE POLICY "Admin users can delete books"
  ON books
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_books_category ON books(category);
CREATE INDEX IF NOT EXISTS idx_books_genre ON books(genre);
CREATE INDEX IF NOT EXISTS idx_books_type ON books(type);
CREATE INDEX IF NOT EXISTS idx_books_rating ON books(rating DESC);
CREATE INDEX IF NOT EXISTS idx_books_created_at ON books(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_books_title_search ON books USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_books_author_search ON books USING gin(to_tsvector('english', author));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_books_updated_at
  BEFORE UPDATE ON books
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();