-- Add verification code to bookings table
-- This code is used for check-in authentication

ALTER TABLE bookings 
ADD COLUMN verification_code VARCHAR(8) UNIQUE,
ADD COLUMN is_checked_in BOOLEAN DEFAULT FALSE,
ADD COLUMN checked_in_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN checked_in_by UUID REFERENCES admin_users(id);

-- Create index for faster verification code lookups
CREATE INDEX idx_bookings_verification_code ON bookings(verification_code);
CREATE INDEX idx_bookings_is_checked_in ON bookings(is_checked_in);

-- Function to generate unique verification code
CREATE OR REPLACE FUNCTION generate_verification_code()
RETURNS VARCHAR(8) AS $$
DECLARE
  code VARCHAR(8);
  exists BOOLEAN;
BEGIN
  LOOP
    -- Generate 8-character alphanumeric code (uppercase letters and numbers only)
    code := UPPER(SUBSTRING(MD5(RANDOM()::TEXT || CLOCK_TIMESTAMP()::TEXT) FROM 1 FOR 8));
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM bookings WHERE verification_code = code) INTO exists;
    
    -- Exit loop if code is unique
    EXIT WHEN NOT exists;
  END LOOP;
  
  RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically generate verification code when booking is confirmed
CREATE OR REPLACE FUNCTION set_verification_code()
RETURNS TRIGGER AS $$
BEGIN
  -- Only generate code when status changes to 'confirmed' and code doesn't exist
  IF NEW.status = 'confirmed' AND (OLD.status IS NULL OR OLD.status != 'confirmed') AND NEW.verification_code IS NULL THEN
    NEW.verification_code := generate_verification_code();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_verification_code
BEFORE INSERT OR UPDATE ON bookings
FOR EACH ROW
EXECUTE FUNCTION set_verification_code();

-- Add comment
COMMENT ON COLUMN bookings.verification_code IS 'Unique 8-character code for check-in verification';
COMMENT ON COLUMN bookings.is_checked_in IS 'Whether guest has checked in at the hotel';
COMMENT ON COLUMN bookings.checked_in_at IS 'Timestamp when guest checked in';
COMMENT ON COLUMN bookings.checked_in_by IS 'Admin user who processed the check-in';
