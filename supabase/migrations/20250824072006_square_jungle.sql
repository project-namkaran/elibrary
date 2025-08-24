/*
  # Create exchange_offers table for book exchange system

  1. New Tables
    - `exchange_offers`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `book_id` (uuid, references books)
      - `condition` (text, book condition)
      - `description` (text, offer description)
      - `wanted_books` (text[], array of wanted book titles/authors)
      - `location` (text, user location)
      - `status` (text, offer status)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `exchange_offers` table
    - Add policies for users to manage their own offers
    - Add policy for all authenticated users to view active offers
    - Add policy for admins to manage all offers

  3. Indexes
    - Index on user_id for user queries
    - Index on book_id for book queries
    - Index on status for filtering active offers
    - Index on created_at for chronological ordering
*/

-- Create exchange_offers table
CREATE TABLE IF NOT EXISTS exchange_offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  book_id uuid NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  condition text NOT NULL CHECK (condition IN ('excellent', 'good', 'fair', 'poor')),
  description text NOT NULL,
  wanted_books text[] DEFAULT '{}',
  location text NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE exchange_offers ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own exchange offers"
  ON exchange_offers
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own exchange offers"
  ON exchange_offers
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own exchange offers"
  ON exchange_offers
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own exchange offers"
  ON exchange_offers
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can view active exchange offers"
  ON exchange_offers
  FOR SELECT
  TO authenticated
  USING (status = 'active');

CREATE POLICY "Admins can manage all exchange offers"
  ON exchange_offers
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_exchange_offers_user_id ON exchange_offers(user_id);
CREATE INDEX IF NOT EXISTS idx_exchange_offers_book_id ON exchange_offers(book_id);
CREATE INDEX IF NOT EXISTS idx_exchange_offers_status ON exchange_offers(status);
CREATE INDEX IF NOT EXISTS idx_exchange_offers_condition ON exchange_offers(condition);
CREATE INDEX IF NOT EXISTS idx_exchange_offers_created_at ON exchange_offers(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_exchange_offers_location ON exchange_offers(location);

-- Create trigger for updated_at
CREATE TRIGGER update_exchange_offers_updated_at
  BEFORE UPDATE ON exchange_offers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();