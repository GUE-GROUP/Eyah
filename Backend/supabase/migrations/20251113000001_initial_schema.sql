-- Eyah's Hotel & Suites - Initial Database Schema
-- Migration: 20251113000001_initial_schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- ROOMS TABLE
-- =====================================================
CREATE TABLE rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url TEXT,
    features JSONB DEFAULT '[]'::jsonb,
    capacity INTEGER NOT NULL DEFAULT 2,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for availability queries
CREATE INDEX idx_rooms_available ON rooms(is_available) WHERE is_available = true;

-- =====================================================
-- BOOKINGS TABLE
-- =====================================================
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE RESTRICT,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    
    -- Guest Information
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    
    -- Booking Details
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    adults INTEGER NOT NULL DEFAULT 1,
    children INTEGER DEFAULT 0,
    rooms INTEGER NOT NULL DEFAULT 1,
    special_requests TEXT,
    
    -- Status and Payment
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
    payment_reference TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_dates CHECK (check_out > check_in),
    CONSTRAINT valid_guests CHECK (adults > 0),
    CONSTRAINT valid_rooms CHECK (rooms > 0)
);

-- Indexes for performance
CREATE INDEX idx_bookings_room_id ON bookings(room_id);
CREATE INDEX idx_bookings_dates ON bookings(check_in, check_out);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_email ON bookings(email);
CREATE INDEX idx_bookings_created_at ON bookings(created_at DESC);

-- =====================================================
-- CONTACT MESSAGES TABLE
-- =====================================================
CREATE TABLE contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'responded')),
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for admin queries
CREATE INDEX idx_contact_messages_status ON contact_messages(status);
CREATE INDEX idx_contact_messages_created_at ON contact_messages(created_at DESC);

-- =====================================================
-- ADMIN USERS TABLE
-- =====================================================
CREATE TABLE admin_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'staff' CHECK (role IN ('admin', 'staff')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- AUDIT LOG TABLE
-- =====================================================
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    table_name TEXT NOT NULL,
    record_id UUID,
    old_data JSONB,
    new_data JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_table ON audit_logs(table_name);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to check room availability
CREATE OR REPLACE FUNCTION check_room_availability(
    p_room_id UUID,
    p_check_in DATE,
    p_check_out DATE
)
RETURNS BOOLEAN AS $$
DECLARE
    conflict_count INTEGER;
BEGIN
    SELECT COUNT(*)
    INTO conflict_count
    FROM bookings
    WHERE room_id = p_room_id
        AND status NOT IN ('cancelled')
        AND (
            (check_in <= p_check_in AND check_out > p_check_in)
            OR (check_in < p_check_out AND check_out >= p_check_out)
            OR (check_in >= p_check_in AND check_out <= p_check_out)
        );
    
    RETURN conflict_count = 0;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate booking total
CREATE OR REPLACE FUNCTION calculate_booking_total(
    p_room_id UUID,
    p_check_in DATE,
    p_check_out DATE,
    p_rooms INTEGER
)
RETURNS DECIMAL AS $$
DECLARE
    room_price DECIMAL;
    nights INTEGER;
    total DECIMAL;
BEGIN
    SELECT price INTO room_price FROM rooms WHERE id = p_room_id;
    nights := p_check_out - p_check_in;
    total := room_price * nights * p_rooms;
    RETURN total;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger for rooms updated_at
CREATE TRIGGER update_rooms_updated_at
    BEFORE UPDATE ON rooms
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for bookings updated_at
CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for contact_messages updated_at
CREATE TRIGGER update_contact_messages_updated_at
    BEFORE UPDATE ON contact_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for admin_users updated_at
CREATE TRIGGER update_admin_users_updated_at
    BEFORE UPDATE ON admin_users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Rooms policies (public read, admin write)
CREATE POLICY "Public can view available rooms" ON rooms
    FOR SELECT USING (is_available = true);

CREATE POLICY "Admins can manage rooms" ON rooms
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE id = auth.uid() AND is_active = true
        )
    );

-- Bookings policies
CREATE POLICY "Users can view their own bookings" ON bookings
    FOR SELECT USING (
        auth.uid() = user_id
        OR email = auth.jwt() ->> 'email'
    );

CREATE POLICY "Users can create bookings" ON bookings
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all bookings" ON bookings
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE id = auth.uid() AND is_active = true
        )
    );

CREATE POLICY "Admins can update bookings" ON bookings
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE id = auth.uid() AND is_active = true
        )
    );

-- Contact messages policies
CREATE POLICY "Anyone can create contact messages" ON contact_messages
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all messages" ON contact_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE id = auth.uid() AND is_active = true
        )
    );

CREATE POLICY "Admins can update messages" ON contact_messages
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE id = auth.uid() AND is_active = true
        )
    );

-- Admin users policies
CREATE POLICY "Admins can view admin users" ON admin_users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE id = auth.uid() AND role = 'admin' AND is_active = true
        )
    );

-- Audit logs policies
CREATE POLICY "Admins can view audit logs" ON audit_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE id = auth.uid() AND is_active = true
        )
    );

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE rooms IS 'Hotel rooms and suites inventory';
COMMENT ON TABLE bookings IS 'Guest bookings and reservations';
COMMENT ON TABLE contact_messages IS 'Customer inquiries from contact form';
COMMENT ON TABLE admin_users IS 'Admin and staff user accounts';
COMMENT ON TABLE audit_logs IS 'Audit trail for all database changes';

COMMENT ON FUNCTION check_room_availability IS 'Check if a room is available for given dates';
COMMENT ON FUNCTION calculate_booking_total IS 'Calculate total amount for a booking';
