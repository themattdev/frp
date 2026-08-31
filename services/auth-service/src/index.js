import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "node:url";
import path from "node:path";
import db from "./db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const port = process.env.PORT;
const publicPath = process.env.PUBLIC_PATH;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "..", "views"));
app.locals.publicPath = publicPath;

app.use(express.static(path.join(__dirname, "..", "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes

// Healthcheck
app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

// Login
app.get("/login", (req, res) => {
    res.render("login", { error: null });
});

app.post("/login", async (req, res) => {

    // Get login information
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password)
        return res.status(400).render("login", { error: "Username and password required!" });

    // Get user from database
    const user = db.prepare("SELECT * FROM users WHERE username = ?").get(username)

    // User not found
    if (!user)
        return res.status(401).render("login", { error: "Login failed!" });

    // Password is correct
    if (await bcrypt.compare(password, user.password_hash)) {

        // Create jwt token
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" })

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000, // One day (same as expiresIn in cookie) TODO: Move to global constant?
            path: "/"
        });

        return res.redirect(publicPath);
    }
    // Password is not correct
    else {
        return res.status(401).render("login", { error: "Login failed!" });
    }

});

// Logout
app.post("/logout", (req, res) => {
    res.clearCookie("token", { path: "/" });
    res.redirect(`${publicPath}/login`);
});


// Dahsboard placeholder after login
app.get("/", (req, res) => {

    const token = req.cookies.token;

    if (!token)
        return res.redirect(`${publicPath}/login`);

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const user = db.prepare("SELECT username FROM users WHERE id = ?").get(payload.userId);
        res.render("dashboard", { username: user.username });
    } catch (err) {
        res.redirect(`${publicPath}/login`);
    }
});

app.listen(port, () => {
    console.log(`auth-service listening on port ${port}`);
});
