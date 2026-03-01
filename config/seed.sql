-- ============================================================
--  FoodLink - Seed Data
--  All passwords are "password123" (bcrypt, cost 10)
--  Run: psql -U postgres -d foodlink -f config/seed.sql
-- ============================================================

-- ----------------------------------------------------------------
-- 1. USERS
-- ----------------------------------------------------------------

-- Donors (IDs will be 1-6)
INSERT INTO users (name, email, password, phone, address, role, donor_subtype, fssai_id, receiver_subtype, govt_id, district, state, pincode)
VALUES
  (
    'The Grand Palace Hotel',
    'grandpalace@hotel.com',
    '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LmTT3SoiTNe',
    '9876543210',
    '12, MG Road, Indiranagar',
    'donor',
    'hotel',
    'FSSAI10023456789',
    NULL, NULL,
    'Bengaluru Urban', 'Karnataka', '560038'
  ),
  (
    'Spice Route Restaurant',
    'spiceroute@restaurant.com',
    '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LmTT3SoiTNe',
    '9876543211',
    '45, Brigade Road, Shivajinagar',
    'donor',
    'restaurant',
    'FSSAI10034567890',
    NULL, NULL,
    'Bengaluru Urban', 'Karnataka', '560001'
  ),
  (
    'Green Valley Grocery',
    'greenvalley@grocery.com',
    '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LmTT3SoiTNe',
    '9876543212',
    '78, Jayanagar 4th Block',
    'donor',
    'grocery_store',
    'FSSAI10045678901',
    NULL, NULL,
    'Bengaluru Urban', 'Karnataka', '560041'
  ),
  (
    'Sunrise Events & Catering',
    'sunrise.events@gmail.com',
    '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LmTT3SoiTNe',
    '9876543213',
    '22, Whitefield Main Road',
    'donor',
    'event_organizer',
    'FSSAI10056789012',
    NULL, NULL,
    'Bengaluru Urban', 'Karnataka', '560066'
  ),
  (
    'Ravi Kumar',
    'ravi.kumar.donor@gmail.com',
    '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LmTT3SoiTNe',
    '9876543214',
    '5, 3rd Cross, Malleshwaram',
    'donor',
    'individual',
    NULL,
    NULL, NULL,
    'Bengaluru Urban', 'Karnataka', '560003'
  ),
  (
    'Taj Continental Hotel',
    'tajcontinental@hotel.com',
    '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LmTT3SoiTNe',
    '9876543215',
    '1, Vittal Mallya Road, Lavelle Road',
    'donor',
    'hotel',
    'FSSAI10067890123',
    NULL, NULL,
    'Bengaluru Urban', 'Karnataka', '560001'
  );

-- Receivers (IDs will be 7-11)
INSERT INTO users (name, email, password, phone, address, role, donor_subtype, fssai_id, receiver_subtype, govt_id, district, state, pincode)
VALUES
  (
    'Asha Foundation NGO',
    'asha.foundation@ngo.org',
    '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LmTT3SoiTNe',
    '9812345678',
    '34, Richmond Circle',
    'receiver',
    NULL, NULL,
    'ngo',
    'NGO/KA/2018/0045',
    'Bengaluru Urban', 'Karnataka', '560025'
  ),
  (
    'Feeding India - Bengaluru Chapter',
    'feedingindia.blr@ngo.org',
    '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LmTT3SoiTNe',
    '9812345679',
    '11, Koramangala 5th Block',
    'receiver',
    NULL, NULL,
    'ngo',
    'NGO/KA/2015/0123',
    'Bengaluru Urban', 'Karnataka', '560095'
  ),
  (
    'Robin Hood Army',
    'robinhood.blr@ngo.org',
    '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LmTT3SoiTNe',
    '9812345680',
    '67, HSR Layout Sector 2',
    'receiver',
    NULL, NULL,
    'ngo',
    'NGO/KA/2017/0389',
    'Bengaluru Urban', 'Karnataka', '560102'
  ),
  (
    'Priya Sharma',
    'priya.sharma.rcv@gmail.com',
    '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LmTT3SoiTNe',
    '9812345681',
    '90, BTM Layout 2nd Stage',
    'receiver',
    NULL, NULL,
    'individual',
    'KA-AADHAAR-8812',
    'Bengaluru Urban', 'Karnataka', '560076'
  ),
  (
    'Nourish Trust',
    'nourish.trust@ngo.org',
    '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LmTT3SoiTNe',
    '9812345682',
    '15, Sadashivanagar, 6th Cross',
    'receiver',
    NULL, NULL,
    'ngo',
    'NGO/KA/2020/0561',
    'Bengaluru Urban', 'Karnataka', '560080'
  );


-- ----------------------------------------------------------------
-- 2. LISTINGS
-- ----------------------------------------------------------------
-- Donor IDs: 1=Grand Palace Hotel, 2=Spice Route, 3=Green Valley,
--            4=Sunrise Events, 5=Ravi Kumar, 6=Taj Continental
-- Receiver IDs: 7=Asha Foundation, 8=Feeding India, 9=Robin Hood,
--               10=Priya Sharma, 11=Nourish Trust

INSERT INTO listings (donor_id, receiver_id, donor_name, food_description, quantity, expiry_time, pickup_address, pickup_phone, latitude, longitude, pickup_time, status)
VALUES
  -- Listing 1: available (no receiver yet)
  (
    1, NULL,
    'The Grand Palace Hotel',
    'Mixed vegetable biryani, dal fry, raita, and rotis from today''s lunch buffet',
    80,
    NOW() + INTERVAL '5 hours',
    '12, MG Road, Indiranagar, Bengaluru - 560038',
    '9876543210',
    12.9716, 77.5946,
    NOW() + INTERVAL '1 hour',
    'available'
  ),
  -- Listing 2: available
  (
    2, NULL,
    'Spice Route Restaurant',
    'Freshly cooked chicken curry, steamed rice, and mixed salad (approx 40 portions)',
    40,
    NOW() + INTERVAL '4 hours',
    '45, Brigade Road, Shivajinagar, Bengaluru - 560001',
    '9876543211',
    12.9792, 77.5913,
    NOW() + INTERVAL '2 hours',
    'available'
  ),
  -- Listing 3: requested (Asha Foundation requested it)
  (
    3, 7,
    'Green Valley Grocery',
    'Near-expiry bread loaves (20 packs), eggs (5 cartons of 12), and packed juices (30 units)',
    55,
    NOW() + INTERVAL '8 hours',
    '78, Jayanagar 4th Block, Bengaluru - 560041',
    '9876543212',
    12.9252, 77.5842,
    NOW() + INTERVAL '3 hours',
    'requested'
  ),
  -- Listing 4: approved (Feeding India approved)
  (
    1, 8,
    'The Grand Palace Hotel',
    'Dinner banquet surplus: paneer butter masala, naan, pulao, desserts (gulab jamun)',
    120,
    NOW() + INTERVAL '6 hours',
    '12, MG Road, Indiranagar, Bengaluru - 560038',
    '9876543210',
    12.9716, 77.5946,
    NOW() + INTERVAL '1 hour',
    'approved'
  ),
  -- Listing 5: picked (Robin Hood Army - completed)
  (
    4, 9,
    'Sunrise Events & Catering',
    'Corporate event leftover meals: sandwiches, fruit platters, snack boxes',
    200,
    NOW() - INTERVAL '1 hour',
    '22, Whitefield Main Road, Bengaluru - 560066',
    '9876543213',
    12.9698, 77.7500,
    NOW() - INTERVAL '3 hours',
    'picked'
  ),
  -- Listing 6: available
  (
    5, NULL,
    'Ravi Kumar',
    'Home-cooked food: rice, sambar, rasam, papad (festival surplus)',
    20,
    NOW() + INTERVAL '3 hours',
    '5, 3rd Cross, Malleshwaram, Bengaluru - 560003',
    '9876543214',
    13.0036, 77.5710,
    NOW() + INTERVAL '1 hour',
    'available'
  ),
  -- Listing 7: approved (Nourish Trust)
  (
    6, 11,
    'Taj Continental Hotel',
    'Breakfast buffet surplus: idli, vada, upma, poha, chutneys, and chai',
    150,
    NOW() + INTERVAL '4 hours',
    '1, Vittal Mallya Road, Lavelle Road, Bengaluru - 560001',
    '9876543215',
    12.9716, 77.5833,
    NOW() + INTERVAL '1 hour',
    'approved'
  ),
  -- Listing 8: requested (Priya Sharma requested)
  (
    2, 10,
    'Spice Route Restaurant',
    'Veg thali meals packed in containers: chapati, sabzi, curd, rice, pickle',
    30,
    NOW() + INTERVAL '5 hours',
    '45, Brigade Road, Shivajinagar, Bengaluru - 560001',
    '9876543211',
    12.9792, 77.5913,
    NOW() + INTERVAL '2 hours',
    'requested'
  ),
  -- Listing 9: picked (Asha Foundation - completed)
  (
    6, 7,
    'Taj Continental Hotel',
    'Dinner table surplus: soup, salads, main course buffet items, and sweets',
    90,
    NOW() - INTERVAL '2 hours',
    '1, Vittal Mallya Road, Lavelle Road, Bengaluru - 560001',
    '9876543215',
    12.9716, 77.5833,
    NOW() - INTERVAL '4 hours',
    'picked'
  ),
  -- Listing 10: available
  (
    3, NULL,
    'Green Valley Grocery',
    'Fruits nearing expiry: bananas (5 dozen), apples (3 kg), mangoes (4 kg)',
    12,
    NOW() + INTERVAL '24 hours',
    '78, Jayanagar 4th Block, Bengaluru - 560041',
    '9876543212',
    12.9252, 77.5842,
    NOW() + INTERVAL '5 hours',
    'available'
  ),
  -- Listing 11: approved (Robin Hood Army)
  (
    4, 9,
    'Sunrise Events & Catering',
    'Wedding event leftover: biryani, kebabs, sweets (ladoo, barfi), cold drinks',
    300,
    NOW() + INTERVAL '3 hours',
    '22, Whitefield Main Road, Bengaluru - 560066',
    '9876543213',
    12.9698, 77.7500,
    NOW() + INTERVAL '30 minutes',
    'approved'
  ),
  -- Listing 12: available
  (
    6, NULL,
    'Taj Continental Hotel',
    'High-tea buffet surplus: pastries, finger sandwiches, cookies, mini quiches',
    60,
    NOW() + INTERVAL '3 hours',
    '1, Vittal Mallya Road, Lavelle Road, Bengaluru - 560001',
    '9876543215',
    12.9716, 77.5833,
    NOW() + INTERVAL '1 hour',
    'available'
  );


-- ----------------------------------------------------------------
-- 3. PICKUP REQUESTS
-- ----------------------------------------------------------------
-- Listing IDs: 1-12 (as inserted above)
-- Receiver IDs: 7-11

INSERT INTO pickup_requests (listing_id, receiver_id, contact_person, contact_phone, status)
VALUES
  -- Request 1: listing 3 (Green Valley Grocery) requested by Asha Foundation (7) - pending
  (
    3, 7,
    'Meena Pillai',
    '9812345678',
    'pending'
  ),
  -- Request 2: listing 4 (Grand Palace Hotel dinner) by Feeding India (8) - approved
  (
    4, 8,
    'Arjun Reddy',
    '9812345679',
    'approved'
  ),
  -- Request 3: listing 5 (Sunrise Events) by Robin Hood Army (9) - complete
  (
    5, 9,
    'Suresh Nair',
    '9812345680',
    'complete'
  ),
  -- Request 4: listing 7 (Taj Breakfast) by Nourish Trust (11) - approved
  (
    7, 11,
    'Kavitha Rao',
    '9812345682',
    'approved'
  ),
  -- Request 5: listing 8 (Spice Route thali) by Priya Sharma (10) - pending
  (
    8, 10,
    'Priya Sharma',
    '9812345681',
    'pending'
  ),
  -- Request 6: listing 9 (Taj dinner) by Asha Foundation (7) - complete
  (
    9, 7,
    'Meena Pillai',
    '9812345678',
    'complete'
  ),
  -- Request 7: listing 11 (Sunrise wedding) by Robin Hood Army (9) - approved
  (
    11, 9,
    'Suresh Nair',
    '9812345680',
    'approved'
  ),
  -- Request 8: listing 1 (Grand Palace biryani) by Feeding India (8) - pending (extra interest)
  (
    1, 8,
    'Arjun Reddy',
    '9812345679',
    'pending'
  );
