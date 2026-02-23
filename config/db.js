require("dotenv").config();
const {Client} = require("pg");

const SQL = `
CREATE TABLE users(
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    address TEXT NOT NULL,
    role VARCHAR(50) CHECK (role IN ('donor', 'receiver')),
    donor_subtype VARCHAR(50) CHECK (donor_subtype IN ('hotel', 'restaurant', 'event_organizer', 'grocery_store', 'individual')),
    fssai_id VARCHAR(100) UNIQUE,
    receiver_subtype VARCHAR(50) CHECK (receiver_subtype IN ('ngo', 'individual')),
    govt_id VARCHAR(100) UNIQUE,
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE listings(
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    donor_id INT NOT NULL REFERENCES users(id),
    receiver_id INT REFERENCES users(id),
    donor_name VARCHAR(255) NOT NULL,
    food_description TEXT NOT NULL,
    quantity INT NOT NULL,
    expiry_time TIMESTAMP NOT NULL,
    pickup_address TEXT NOT NULL,
    pickup_phone VARCHAR(20) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    pickup_time TIMESTAMP NOT NULL,
    status VARCHAR(20) DEFAULT 'available' CHECK(status IN ('available', 'requested', 'approved', 'picked')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pickup_requests(
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    listing_id INT NOT NULL REFERENCES listings(id),
    receiver_id INT NOT NULL REFERENCES users(id),
    contact_person VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'complete')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

async function main() {
    console.log("Seeding...");
    const client = new Client({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });
    await client.connect();
    await client.query(SQL);
    await client.end();
    console.log("Done!");
}

main();