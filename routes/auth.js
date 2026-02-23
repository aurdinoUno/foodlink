const {Router} = require("express");
const bcrypt = require("bcrypt");
const pool = require("../config/pool");

const router = Router();

router.get("/sign-up", (req, res) => {
    res.render("sign_up");
});

router.post("/sign-up", async (req, res) => {
    const {name, email, password, phone, address, role, donor_subtype, fssai_id, receiver_subtype, receiver_id, govt_id, district, state, pincode} = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const values = [
        name, email, hashedPassword, phone, address, role,
        role === 'donor' ? donor_subtype : null,
        role === 'donor' ? fssai_id : null,
        role === 'receiver' ? receiver_subtype : null,
        role === 'receiver' ? govt_id : null,
        district, state, pincode
    ];

    // await pool.query("INSERT INTO users(name, email, password, phone, address, role, donor_subtype, fssai_id, receiver_subtype, govt_id, district, state, pincode) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)", [name, email, hashedPassword, phone, address, role, donor_subtype, fssai_id, receiver_subtype, govt_id, district, state, pincode]);
    await pool.query("INSERT INTO users(name, email, password, phone, address, role, donor_subtype, fssai_id, receiver_subtype, govt_id, district, state, pincode) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)", values);

    res.redirect("/auth/login");
})

router.get("/login", (req, res) => {
    res.render("login");
});

router.post("/login", async (req, res) => {
    const {email, password} = req.body;

    const {rows} = await pool.query("SELECT * FROM users WHERE email = ($1)", [email]);
    if (rows.length === 0){
        res.redirect("/auth/sign-up");
    }
    const user = rows[0];

    const match = bcrypt.compare(password, user.password);
    if (!match){
        res.redirect("/auth/login");
    }

    req.session.user = user;

    if (user.role === "donor"){
        res.redirect("/donor/dashboard");
    }
    if (user.role == "receiver"){
        res.redirect("/receiver/dashboard");
    }
});

router.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/");
})

module.exports = router;