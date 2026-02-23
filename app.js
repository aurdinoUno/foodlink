require("dotenv").config();
const express = require("express");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const pool = require("./config/pool");

const app = express();

const HOST_NAME = process.env.HOST_NAME || "localhost";
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
        maxAge: 1000*60*60*60
    }
}));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static("public"));

app.use("/auth", require("./routes/auth"));
app.use("/donor", require("./routes/donor"));
app.use("/receiver", require("./routes/receiver"));
app.use("/listing", require("./routes/listings"));
app.use("/", (req, res) => {
    res.render("home");
})