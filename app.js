require("dotenv").config();
const express = require("express");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const pool = require("./config/pool");

const app = express();

const HOST_NAME = "0.0.0.0";
const PORT = process.env.PORT || 3000;
app.listen(PORT, HOST_NAME, () => {
    console.log("Server is listening for requests!");
});

app.set("views", "views");
app.set("view engine", "ejs");

app.use(session({
    store: new pgSession({
        pool: pool,
        tableName: "session",
        createTableIfMissing: true
    }),
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 60
    }
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.use("/auth", require("./routes/auth"));
app.use("/donor", require("./routes/donor"));
app.use("/receiver", require("./routes/receiver"));
app.use("/listing", require("./routes/listings"));

// Proxy for the compost AI service (avoids browser CORS restrictions)
app.post("/api/compost", async (req, res) => {
    try {
        const { waste_item } = req.body;
        if (!waste_item) return res.status(400).json({ error: "waste_item is required" });

        const aiRes = await fetch("https://food-waste-management-ai-service.onrender.com/ai/compost", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ waste_item })
        });

        const data = await aiRes.json();
        res.status(aiRes.status).json(data);
    } catch (err) {
        res.status(502).json({ error: "AI service unavailable. Please try again." });
    }
});

// Proxy for the Chef AI recipe service
app.post("/api/recipe", async (req, res) => {
    try {
        const { ingredients, constraints } = req.body;
        if (!ingredients) return res.status(400).json({ error: "ingredients is required" });

        // Accept comma-separated string or array
        const ingredientArr = Array.isArray(ingredients)
            ? ingredients
            : ingredients.split(",").map(s => s.trim()).filter(Boolean);

        const aiRes = await fetch("https://chef-ai-yt2x.onrender.com/recommend", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ingredients: ingredientArr, constraints: constraints || "None" })
        });

        const text = await aiRes.text();
        // API returns a plain string, wrap it
        try {
            const json = JSON.parse(text);
            res.status(aiRes.status).json({ recipe: typeof json === 'string' ? json : JSON.stringify(json) });
        } catch {
            res.status(aiRes.status).json({ recipe: text });
        }
    } catch (err) {
        res.status(502).json({ error: "Chef AI service unavailable. Please try again." });
    }
});

app.get("/about", (req, res) => res.render("about"));

app.use("/", async (req, res) => {
    try {
        // Meals saved = sum of quantity from listings that were picked up
        const mealsSavedRes = await pool.query(
            "SELECT COALESCE(SUM(quantity::int), 0) AS meals FROM listings WHERE status = 'picked'"
        );

        // Donor & receiver counts
        const donorCountRes = await pool.query("SELECT COUNT(*) AS cnt FROM users WHERE role = 'donor'");
        const receiverCountRes = await pool.query("SELECT COUNT(*) AS cnt FROM users WHERE role = 'receiver'");

        // Top 5 donors by total quantity donated (picked up)
        const topDonorsRes = await pool.query(`
            SELECT u.name, COALESCE(SUM(l.quantity::int), 0) AS total_donated
            FROM users u
            JOIN listings l ON l.donor_id = u.id
            WHERE l.status = 'picked'
            GROUP BY u.id, u.name
            ORDER BY total_donated DESC
            LIMIT 5
        `);

        const mealsSaved = parseInt(mealsSavedRes.rows[0].meals) || 0;
        const donorCount = parseInt(donorCountRes.rows[0].cnt) || 0;
        const receiverCount = parseInt(receiverCountRes.rows[0].cnt) || 0;
        // Approx CO2: 1 meal ≈ 0.5 kg food saved ≈ 1.25 kg CO2 equivalent
        const co2Saved = (mealsSaved * 1.25).toFixed(0);

        res.render("home", {
            mealsSaved,
            donorCount,
            receiverCount,
            co2Saved,
            topDonors: topDonorsRes.rows
        });
    } catch (err) {
        console.error("Home route error:", err);
        res.render("home", { mealsSaved: 0, donorCount: 0, receiverCount: 0, co2Saved: 0, topDonors: [] });
    }
});