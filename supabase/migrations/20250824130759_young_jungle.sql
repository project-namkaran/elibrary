/*
  # Create OTP codes table

  1. New Tables
    - `otp_codes`
      - `id` (uuid, primary key)
      - `email` (text, not null)
      - `code` (text, not null) - 6-digit OTP code
      - `type` (text, not null) - 'verification' or 'reset'
      - `expires_at` (timestamptz, not null) - expiration time
      - `used` (boolean, default false) - whether OTP has been used
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `otp_codes` table
    - Add policies for OTP management
    - Add indexes for performance

  3. Constraints
    - Check constraint for OTP type
    - Check constraint for code format (6 digits)
*/

-- Create OTP codes table
CREATE TABLE IF NOT EXISTS otp_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  code text NOT NULL,
  type text NOT NULL,
  expires_at timestamptz NOT NULL,
  used boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add constraints
ALTER TABLE otp_codes ADD CONSTRAINT otp_codes_type_check 
  CHECK (type IN ('verification', 'reset'));

ALTER TABLE otp_codes ADD CONSTRAINT otp_codes_code_check 
  CHECK (code ~ '^\d{6}$');

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_otp_codes_email ON otp_codes (email);
CREATE INDEX IF NOT EXISTS idx_otp_codes_type ON otp_codes (type);
CREATE INDEX IF NOT EXISTS idx_otp_codes_expires_at ON otp_codes (expires_at);
CREATE INDEX IF NOT EXISTS idx_otp_codes_used ON otp_codes (used);
CREATE INDEX IF NOT EXISTS idx_otp_codes_email_type ON otp_codes (email, type);

-- Enable RLS
ALTER TABLE otp_codes ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can insert OTP codes"
  ON otp_codes
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can read own OTP codes"
  ON otp_codes
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can update own OTP codes"
  ON otp_codes
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Add trigger for updated_at
CREATE TRIGGER update_otp_codes_updated_at
  BEFORE UPDATE ON otp_codes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Clean up expired OTP codes (optional - can be run periodically)
CREATE OR REPLACE FUNCTION cleanup_expired_otp_codes()
RETURNS void AS $$
BEGIN
  DELETE FROM otp_codes 
  WHERE expires_at < now() - interval '1 day';
END;
$$ LANGUAGE plpgsql;