-- ============================================================
--  FoodLink - Delhi Seed Data
--  Password for all users: "password123" (bcrypt, cost 10)
--  Run: psql -U postgres -d foodlink -f config/seed_delhi.sql
-- ============================================================

-- ----------------------------------------------------------------
-- 1. USERS  (IDs auto-assigned, will follow after existing 11)
-- ----------------------------------------------------------------

-- Delhi Donor (ID ~12)
INSERT INTO users (name, email, password, phone, address, role, donor_subtype, fssai_id, receiver_subtype, govt_id, district, state, pincode)
VALUES (
  'The Imperial Banquet Hall',
  'imperial.banquet@hotel.com',
  '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LmTT3SoiTNe',
  '9911223344',
  '8, Janpath Road, Connaught Place',
  'donor',
  'hotel',
  'FSSAI07098765432',
  NULL, NULL,
  'New Delhi', 'Delhi', '110001'
);

-- Delhi Receiver (ID ~13)
INSERT INTO users (name, email, password, phone, address, role, donor_subtype, fssai_id, receiver_subtype, govt_id, district, state, pincode)
VALUES (
  'Sewa Bharati Delhi',
  'sewabharati.delhi@ngo.org',
  '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LmTT3SoiTNe',
  '9911223355',
  '22, Laxmi Nagar, District Centre',
  'receiver',
  NULL, NULL,
  'ngo',
  'NGO/DL/2016/0078',
  'East Delhi', 'Delhi', '110092'
);

-- ----------------------------------------------------------------
-- 2. LISTINGS  (donor_id and receiver_id reference the NEW users)
-- ----------------------------------------------------------------
-- We use subqueries so the IDs don't need to be hardcoded.

INSERT INTO listings (donor_id, receiver_id, donor_name, food_description, quantity, expiry_time, pickup_address, pickup_phone, latitude, longitude, pickup_time, status)
VALUES
  -- Listing A: available
  (
    (SELECT id FROM users WHERE email = 'imperial.banquet@hotel.com'),
    NULL,
    'The Imperial Banquet Hall',
    'Gala dinner surplus: dal makhani, shahi paneer, jeera rice, tandoori roti, raita, gulab jamun (approx 100 portions)',
    100,
    NOW() + INTERVAL '5 hours',
    '8, Janpath Road, Connaught Place, New Delhi - 110001',
    '9911223344',
    28.6297, 77.2196,
    NOW() + INTERVAL '1 hour',
    'available'
  ),
  -- Listing B: approved (receiver = Sewa Bharati)
  (
    (SELECT id FROM users WHERE email = 'imperial.banquet@hotel.com'),
    (SELECT id FROM users WHERE email = 'sewabharati.delhi@ngo.org'),
    'The Imperial Banquet Hall',
    'Morning breakfast buffet leftover: aloo paratha, chole bhature, lassi, fruit salad (70 portions)',
    70,
    NOW() + INTERVAL '4 hours',
    '8, Janpath Road, Connaught Place, New Delhi - 110001',
    '9911223344',
    28.6297, 77.2196,
    NOW() + INTERVAL '45 minutes',
    'approved'
  ),
  -- Listing C: picked (completed earlier today)
  (
    (SELECT id FROM users WHERE email = 'imperial.banquet@hotel.com'),
    (SELECT id FROM users WHERE email = 'sewabharati.delhi@ngo.org'),
    'The Imperial Banquet Hall',
    'Corporate lunch buffet: veg biryani, mix veg sabzi, raita, naan, sweet (50 portions)',
    50,
    NOW() - INTERVAL '1 hour',
    '8, Janpath Road, Connaught Place, New Delhi - 110001',
    '9911223344',
    28.6297, 77.2196,
    NOW() - INTERVAL '3 hours',
    'picked'
  );

-- ----------------------------------------------------------------
-- 3. PICKUP REQUESTS
-- ----------------------------------------------------------------

INSERT INTO pickup_requests (listing_id, receiver_id, contact_person, contact_phone, status)
VALUES
  -- Request for Listing B (approved)
  (
    (SELECT id FROM listings WHERE donor_id = (SELECT id FROM users WHERE email = 'imperial.banquet@hotel.com') AND status = 'approved'),
    (SELECT id FROM users WHERE email = 'sewabharati.delhi@ngo.org'),
    'Ramesh Gupta',
    '9911223355',
    'approved'
  ),
  -- Request for Listing C (complete)
  (
    (SELECT id FROM listings WHERE donor_id = (SELECT id FROM users WHERE email = 'imperial.banquet@hotel.com') AND status = 'picked'),
    (SELECT id FROM users WHERE email = 'sewabharati.delhi@ngo.org'),
    'Ramesh Gupta',
    '9911223355',
    'complete'
  );
