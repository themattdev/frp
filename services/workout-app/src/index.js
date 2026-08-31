import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import { requireAuth } from "./middleware/requireAuth.js";

const app = express();
const port = process.env.PORT;

app.use(cookieParser());

app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

app.get("/", requireAuth, (req, res) => {
    res.json({ message: "Eingeloggt", userId: req.user.userId });
});

app.listen(port, () => {
    console.log(`workout-app listening on port ${port}`);
});
