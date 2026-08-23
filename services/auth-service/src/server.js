import "dotenv/config";
import express from "express";

const app = express();
const port = process.env.PORT;

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`auth-service listening on port ${port}`);
});
