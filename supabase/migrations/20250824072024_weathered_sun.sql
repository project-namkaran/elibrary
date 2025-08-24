/*
  # Create system_settings table for application configuration

  1. New Tables
    - `system_settings`
      - `id` (uuid, primary key)
      - `key` (text, unique setting key)
      - `value` (jsonb, setting value)
      - `description` (text, setting description)
      - `category` (text, setting category)
      - `is_public` (boolean, if setting is publicly readable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `system_settings` table
    - Add policy for public to read public settings
    - Add policy for admins to manage all settings

  3. Indexes
    - Unique index on key
    - Index on category for grouping
    - Index on is_public for filtering
*/

-- Create system_settings table
CREATE TABLE IF NOT EXISTS system_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL DEFAULT '{}',
  description text,
  category text NOT NULL DEFAULT 'general',
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can read public settings"
  ON system_settings
  FOR SELECT
  TO public
  USING (is_public = true);

CREATE POLICY "Admins can read all settings"
  ON system_settings
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can manage all settings"
  ON system_settings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create indexes
CREATE UNIQUE INDEX IF NOT EXISTS idx_system_settings_key ON system_settings(key);
CREATE INDEX IF NOT EXISTS idx_system_settings_category ON system_settings(category);
CREATE INDEX IF NOT EXISTS idx_system_settings_is_public ON system_settings(is_public);

-- Create trigger for updated_at
CREATE TRIGGER update_system_settings_updated_at
  BEFORE UPDATE ON system_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default settings
INSERT INTO system_settings (key, value, description, category, is_public) VALUES
  ('site_name', '"E-Library"', 'Name of the application', 'general', true),
  ('site_description', '"Modern digital library platform"', 'Description of the application', 'general', true),
  ('maintenance_mode', 'false', 'Enable maintenance mode', 'general', false),
  ('allow_registration', 'true', 'Allow new user registration', 'auth', false),
  ('max_books_per_user', '10', 'Maximum books a user can borrow', 'limits', false),
  ('loan_duration_days', '14', 'Default loan duration in days', 'limits', false),
  ('email_notifications', 'true', 'Enable email notifications', 'notifications', false),
  ('auto_backup', 'true', 'Enable automatic backups', 'backup', false),
  ('backup_frequency', '"daily"', 'Backup frequency', 'backup', false)
ON CONFLICT (key) DO NOTHING;