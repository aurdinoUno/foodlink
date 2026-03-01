const { Router } = require("express");
const pool = require("../config/pool");

const router = Router();

function urgencyScore(listing) {
    const hoursLeft = (new Date(listing.expiry_time) - Date.now()) / 3600000;
    const qty = parseInt(listing.quantity) || 0;

    let timeScore;
    if (hoursLeft <= 0) timeScore = 130;
    else if (hoursLeft <= 2) timeScore = 100;
    else if (hoursLeft <= 6) timeScore = 70;
    else if (hoursLeft <= 12) timeScore = 50;
    else if (hoursLeft <= 24) timeScore = 30;
    else timeScore = 10;

    const quantityScore = Math.min(qty / 2, 30);

    return timeScore + quantityScore;
}

function urgencyLabel(score) {
    if (score >= 100) return { label: 'CRITICAL', color: '#dc3545' };
    if (score >= 70) return { label: 'HIGH', color: '#fd7e14' };
    if (score >= 50) return { label: 'MEDIUM', color: '#ffc107' };
    if (score >= 30) return { label: 'LOW', color: '#28a745' };
    return { label: 'LOW', color: '#28a745' };
}

router.get("/dashboard", async (req, res) => {
    const listings = (await pool.query(
        "SELECT * FROM listings WHERE status = 'available'"
    )).rows;

    const total_available = listings.length;

    listings.forEach(l => {
        l.urgency_score = urgencyScore(l);
        const u = urgencyLabel(l.urgency_score);
        l.urgency_label = u.label;
        l.urgency_color = u.color;
    });

    listings.sort((a, b) => b.urgency_score - a.urgency_score);

    res.render("receiver_dashboard", { listings, total_available, user: req.session.user });
});

router.get("/history", async (req, res) => {
    const receiverId = req.session.user.id;
    const listings = (await pool.query(
        "SELECT * FROM listings WHERE receiver_id = $1 ORDER BY created_at DESC",
        [receiverId]
    )).rows;
    res.render("receiver_history", { requests: listings });
});

module.exports = router;