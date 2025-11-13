-- Eyah's Hotel & Suites - Seed Data
-- Initial data for development and testing

-- =====================================================
-- SEED ROOMS
-- =====================================================

INSERT INTO rooms (name, description, price, image_url, features, capacity, is_available) VALUES
(
    'COMFY DELUX',
    'Experience comfort and elegance in our Comfy Delux rooms, perfect for a relaxing stay.',
    40000.00,
    '/images/img (7).jpg',
    '["King Size Bed", "Free WiFi", "Air Conditioning", "Flat Screen TV", "Mini Bar"]'::jsonb,
    2,
    true
),
(
    'Super Deluxe',
    'Indulge in luxury with our Super Deluxe rooms featuring premium amenities and stunning views.',
    45000.00,
    '/images/img (7).jpg',
    '["King Size Bed", "Free WiFi", "Air Conditioning", "Flat Screen TV", "Mini Bar", "Balcony", "Work Desk"]'::jsonb,
    2,
    true
),
(
    'Luxury Splash',
    'Dive into luxury with our Luxury Splash rooms, complete with spa-like bathrooms and modern design.',
    50000.00,
    '/images/img (8).jpg',
    '["King Size Bed", "Free WiFi", "Air Conditioning", "Smart TV", "Mini Bar", "Jacuzzi", "Premium Toiletries"]'::jsonb,
    2,
    true
),
(
    'Avalanche Suite',
    'Experience the pinnacle of comfort in our spacious Avalanche Suite with separate living area.',
    70000.00,
    '/images/img (8).jpg',
    '["King Size Bed", "Free WiFi", "Air Conditioning", "Smart TV", "Mini Bar", "Living Room", "Dining Area", "Kitchenette"]'::jsonb,
    4,
    true
),
(
    'Business Executive Suite',
    'Perfect for business travelers, featuring a dedicated workspace and premium business amenities.',
    150000.00,
    '/images/img (9).jpg',
    '["King Size Bed", "Free WiFi", "Air Conditioning", "Smart TV", "Executive Desk", "Meeting Space", "Coffee Machine"]'::jsonb,
    2,
    true
),
(
    'Presidential Suite',
    'The ultimate luxury experience with panoramic views, private dining, and exclusive services.',
    200000.00,
    '/images/img (9).jpg',
    '["King Size Bed", "Free WiFi", "Air Conditioning", "Smart TV", "Living Room", "Dining Room", "Kitchen", "Butler Service", "Private Balcony"]'::jsonb,
    4,
    true
),
(
    'Banquet Hall',
    'Spacious banquet hall perfect for weddings, conferences, and special events with premium catering services.',
    250000.00,
    '/images/img (6).jpg',
    '["Seating for 200+", "Audio/Visual Equipment", "Stage", "Air Conditioning", "Catering Services", "Parking Space", "Decoration Services"]'::jsonb,
    200,
    true
);

-- =====================================================
-- SEED SAMPLE BOOKINGS (for testing)
-- =====================================================

-- Note: These are sample bookings for development
-- In production, bookings will be created by users

INSERT INTO bookings (
    room_id,
    first_name,
    last_name,
    email,
    phone,
    check_in,
    check_out,
    adults,
    children,
    rooms,
    special_requests,
    status,
    total_amount,
    payment_status
) VALUES
(
    (SELECT id FROM rooms WHERE name = 'Presidential Suite' LIMIT 1),
    'John',
    'Doe',
    'john.doe@example.com',
    '+234 912 855 5191',
    CURRENT_DATE + INTERVAL '7 days',
    CURRENT_DATE + INTERVAL '10 days',
    2,
    0,
    1,
    'Late check-in requested',
    'confirmed',
    600000.00,
    'paid'
),
(
    (SELECT id FROM rooms WHERE name = 'COMFY DELUX' LIMIT 1),
    'Jane',
    'Smith',
    'jane.smith@example.com',
    '+234 816 333 2977',
    CURRENT_DATE + INTERVAL '3 days',
    CURRENT_DATE + INTERVAL '5 days',
    1,
    1,
    1,
    '',
    'pending',
    80000.00,
    'pending'
),
(
    (SELECT id FROM rooms WHERE name = 'Business Executive Suite' LIMIT 1),
    'Michael',
    'Johnson',
    'michael.j@example.com',
    '+234 912 855 5191',
    CURRENT_DATE + INTERVAL '14 days',
    CURRENT_DATE + INTERVAL '16 days',
    2,
    0,
    1,
    'Airport pickup needed',
    'confirmed',
    300000.00,
    'paid'
);

-- =====================================================
-- SEED CONTACT MESSAGES (for testing)
-- =====================================================

INSERT INTO contact_messages (name, email, phone, subject, message, status) VALUES
(
    'Sarah Williams',
    'sarah.w@example.com',
    '+234 912 855 5191',
    'Banquet Hall Inquiry',
    'I would like to inquire about booking the banquet hall for a wedding reception in December. Could you please provide more details about capacity, catering options, and pricing?',
    'unread'
),
(
    'David Brown',
    'david.brown@example.com',
    '+234 816 333 2977',
    'Corporate Event',
    'We are planning a corporate retreat and need accommodation for 50 people. Do you offer group discounts? Also, do you have conference facilities?',
    'read'
),
(
    'Emily Davis',
    'emily.d@example.com',
    '+234 912 855 5191',
    'Long-term Stay',
    'I am relocating to Makurdi for work and need accommodation for 3 months. Do you offer monthly rates?',
    'responded'
);

-- =====================================================
-- CREATE ADMIN USER
-- =====================================================

-- Note: This creates a placeholder admin user
-- In production, create admin users through Supabase Auth
-- Then add them to admin_users table

-- First, you need to create the user in Supabase Auth dashboard
-- Then run this to add them to admin_users:

-- INSERT INTO admin_users (id, email, full_name, role, is_active)
-- VALUES (
--     'YOUR_AUTH_USER_ID',
--     'admin@eyahshotel.com',
--     'Admin User',
--     'admin',
--     true
-- );

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Verify rooms were inserted
SELECT COUNT(*) as room_count FROM rooms;

-- Verify bookings were inserted
SELECT COUNT(*) as booking_count FROM bookings;

-- Verify contact messages were inserted
SELECT COUNT(*) as message_count FROM contact_messages;

-- Show all rooms with availability
SELECT name, price, is_available FROM rooms ORDER BY price;

-- Show upcoming bookings
SELECT 
    b.id,
    b.first_name || ' ' || b.last_name as guest_name,
    r.name as room_name,
    b.check_in,
    b.check_out,
    b.status
FROM bookings b
JOIN rooms r ON b.room_id = r.id
WHERE b.check_in >= CURRENT_DATE
ORDER BY b.check_in;
