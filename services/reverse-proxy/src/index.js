import "dotenv/config";
import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();
const port = process.env.PORT;

app.use("/auth", createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/auth": "" },
}));

app.use("/workouts", createProxyMiddleware({
    target: process.env.WORKOUT_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/workouts": "" },
}));

app.listen(port, () => {
    console.log(`reverse-proxy listening on port ${port}`);
});
