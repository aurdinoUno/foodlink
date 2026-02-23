const {Router} = require("express");
const pool = require("../config/pool");

const router = Router();

router.get("/create", (req, res) => {
    res.render("create_listing");
});

router.post("/create", async (req, res) => {
    const {description, quantity, expiry, pickup_address, pickup_phone, pickup_time, latitude, longitude} = req.body;

    await pool.query("INSERT INTO listings(donor_id, donor_name, food_description, quantity, expiry_time, pickup_address, pickup_phone, pickup_time, latitude, longitude) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)", [
    req.session.user.id, req.session.user.name, description, quantity, expiry, pickup_address, req.session.user.phone, pickup_time, latitude, longitude]);

    res.redirect("/donor/dashboard");
});

router.get("/:id", async (req, res) => {
    const listingId = req.params.id;

    const listing = (await pool.query("SELECT * FROM listings WHERE id = ($1)", [listingId])).rows[0];
    const pickup_request = (await pool.query("SELECT * FROM pickup_requests WHERE listing_id = ($1)", [listingId])).rows[0];

    res.render("listing_details", {listing: listing, pickup_request: pickup_request, user_role: req.session.user.role})
})

router.post("/:id/request", async (req, res) => {
    const listingId = req.params.id;
    const receiver = req.session.user;
    console.log(req.session.user);

    await pool.query("INSERT INTO pickup_requests(listing_id, receiver_id, contact_person, contact_phone) VALUES ($1,$2,$3,$4)", [listingId, receiver.id, receiver.name, receiver.phone]);

    await pool.query("UPDATE listings SET status = 'requested', receiver_id = ($2) WHERE id= ($1)", [listingId, receiver.id]);

    res.redirect("/receiver/dashboard");
});

router.post("/:id/approve", async (req, res) => {
    const listingId = req.params.id;

    await pool.query("UPDATE listings SET status='approved' WHERE id = ($1)", [listingId]);
    await pool.query("UPDATE pickup_requests SET status='approved' WHERE listing_id = ($1)", [listingId]);

    res.redirect("/donor/dashboard");
});

router.post("/:id/complete", async (req, res) => {
    const listingId = req.params.id;

    await pool.query("UPDATE listings SET status='picked' WHERE id = ($1)", [listingId]);
    await pool.query("UPDATE pickup_requests SET status='complete' WHERE listing_id = ($1)", [listingId]);

    res.redirect("/reciever/dashboard");
});

module.exports = router;