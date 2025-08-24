/*
  # Create user_books table for tracking user book relationships

  1. New Tables
    - `user_books`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `book_id` (uuid, references books)
      - `relationship_type` (text: 'borrowed', 'purchased', 'wishlist')
      - `status` (text: 'active', 'returned', 'completed')
      - `progress` (integer, reading progress percentage)
      - `last_position` (text, last reading position)
      - `acquired_date` (timestamp)
      - `due_date` (timestamp, for borrowed books)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `user_books` table
    - Add policies for users to manage their own book relationships
    - Add policy for admins to view all relationships

  3. Indexes
    - Index on user_id for user queries
    - Index on book_id for book queries
    - Index on relationship_type for filtering
    - Composite index on user_id and relationship_type
*/

-- Create user_books table
CREATE TABLE IF NOT EXISTS user_books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  book_id uuid NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  relationship_type text NOT NULL CHECK (relationship_type IN ('borrowed', 'purchased', 'wishlist', 'exchange')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'returned', 'completed', 'pending')),
  progress integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  last_position text,
  acquired_date timestamptz DEFAULT now(),
  due_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, book_id, relationship_type)
);

-- Enable RLS
ALTER TABLE user_books ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own book relationships"
  ON user_books
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own book relationships"
  ON user_books
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own book relationships"
  ON user_books
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own book relationships"
  ON user_books
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all book relationships"
  ON user_books
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can manage all book relationships"
  ON user_books
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_books_user_id ON user_books(user_id);
CREATE INDEX IF NOT EXISTS idx_user_books_book_id ON user_books(book_id);
CREATE INDEX IF NOT EXISTS idx_user_books_relationship_type ON user_books(relationship_type);
CREATE INDEX IF NOT EXISTS idx_user_books_status ON user_books(status);
CREATE INDEX IF NOT EXISTS idx_user_books_user_relationship ON user_books(user_id, relationship_type);
CREATE INDEX IF NOT EXISTS idx_user_books_acquired_date ON user_books(acquired_date DESC);

-- Create trigger for updated_at
CREATE TRIGGER update_user_books_updated_at
  BEFORE UPDATE ON user_books
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();