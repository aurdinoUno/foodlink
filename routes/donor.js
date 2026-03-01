const { Router } = require("express");
const pool = require("../config/pool");

const router = Router();

router.get("/dashboard", async (req, res) => {
    const donorId = req.session.user.id;

    const listings = (await pool.query(
        "SELECT * FROM listings WHERE donor_id = $1 AND status IN ('available', 'requested', 'approved') ORDER BY created_at DESC",
        [donorId]
    )).rows;

    const total_active = listings.length;

    const statsRes = await pool.query(
        "SELECT COALESCE(SUM(quantity::int), 0) AS meals FROM listings WHERE donor_id = $1 AND status = 'picked'",
        [donorId]
    );
    const myMeals = parseInt(statsRes.rows[0].meals) || 0;
    const myCO2 = (myMeals * 1.25).toFixed(1);
    const myCredits = Math.round(myMeals * 10 + parseFloat(myCO2) * 5);

    const leaderboardRes = await pool.query(`
        SELECT u.id, u.name,
               COALESCE(SUM(l.quantity::int), 0) AS meals,
               ROUND(COALESCE(SUM(l.quantity::int), 0) * 1.25, 1) AS co2,
               ROUND(COALESCE(SUM(l.quantity::int), 0) * 10 + COALESCE(SUM(l.quantity::int), 0) * 1.25 * 5, 0) AS credits
        FROM users u
        LEFT JOIN listings l ON l.donor_id = u.id AND l.status = 'picked'
        WHERE u.role = 'donor'
        GROUP BY u.id, u.name
        ORDER BY credits DESC
        LIMIT 10
    `);

    const myRankRes = await pool.query(`
        SELECT rank FROM (
            SELECT u.id,
                   RANK() OVER (ORDER BY COALESCE(SUM(l.quantity::int), 0) * 10 + COALESCE(SUM(l.quantity::int), 0) * 1.25 * 5 DESC) AS rank
            FROM users u
            LEFT JOIN listings l ON l.donor_id = u.id AND l.status = 'picked'
            WHERE u.role = 'donor'
            GROUP BY u.id
        ) ranked WHERE id = $1
    `, [donorId]);

    const myRank = myRankRes.rows.length > 0 ? parseInt(myRankRes.rows[0].rank) : '-';

    res.render("donor_dashboard", {
        listings,
        total_active,
        user: req.session.user,
        myMeals,
        myCO2,
        myCredits,
        myRank,
        leaderboard: leaderboardRes.rows
    });
});

router.get("/history", async (req, res) => {
    const donorId = req.session.user.id;
    const listings = (await pool.query("SELECT * FROM listings WHERE donor_id = ($1) ORDER BY created_at DESC", [donorId])).rows;
    res.render("donor_history", { donations: listings });
});

module.exports = router;