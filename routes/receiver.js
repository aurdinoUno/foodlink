const {Router} = require("express");
const pool = require("../config/pool");

const router = Router();

router.get("/dashboard", async (req, res) => {
    // const {rows} = await pool.query("SELECT listings.*, users.name FROM listings JOIN users ON listings.donor_id = users.id WHERE listings.status='available' ORDER BY listings.created_at DESC");
    // const {rows} = await pool.query("SELECT listings.*, users.name, users.phone FROM listings JOIN users ON listings.donor_id = users.id ORDER BY expiry_time ASC, quantity DESC, listings.created_at DESC");
    const users = (await pool.query("SELECT * FROM users")).rows;
    const listings = (await pool.query("SELECT * FROM listings WHERE status = 'available' ORDER BY expiry_time ASC, quantity DESC, created_at DESC")).rows;

    const total_available = parseInt((await pool.query("SELECT COUNT(*) FROM listings WHERE status = 'available'")).rows[0].count);

    res.render("receiver_dashboard", {listings: listings, total_available: total_available, users: users});
});

router.get("/history", async (req, res) => {
    const receiverId = req.session.user.id;

    // const {rows} = await pool.query("SELECT listings.*, pickup_requests.status AS request_status FROM pickup_requests JOIN listings ON pickup_requests.listing_id = listings.id WHERE pickup_requests.ngo_id = $1 ORDER BY listings.created_at DESC", [ngoId]);
    const listings = (await pool.query("SELECT * FROM listings WHERE receiver_id = ($1) ORDER BY created_at DESC", [receiverId])).rows;
    
    res.render("receiver_history", {requests: listings});
});

module.exports = router;