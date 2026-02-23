const {Router} = require("express");
const pool = require("../config/pool");

const router = Router();

router.get("/dashboard", async (req, res) => {
    const donorId = req.session.user.id;

    // const {rows} = await pool.query("SELECT listings.*, pickup_requests.contact_person, pickup_requests.contact_phone FROM listings LEFT JOIN pickup_requests ON listings.id = pickup_requests.listing_id WHERE listings.donor_id = $1 ORDER BY listings.created_at DESC", [donorId]);

    const listings = (await pool.query("SELECT * FROM listings WHERE donor_id = ($1) AND status IN ('available', 'requested') ORDER BY created_at DESC", [donorId])).rows;

    const total_active = parseInt((await pool.query("SELECT COUNT(*) FROM listings WHERE donor_id = ($1) AND status IN ('available', 'requested')", [donorId])).rows[0].count);

    res.render("donor_dashboard", {listings: listings, total_active: total_active});
});

router.get("/history", async (req, res) => {
    const donorId = req.session.user.id;

    const listings = (await pool.query("SELECT * FROM listings WHERE donor_id = ($1) ORDER BY created_at DESC", [donorId])).rows;

    res.render("donor_history", {donations: listings});
});

module.exports = router;