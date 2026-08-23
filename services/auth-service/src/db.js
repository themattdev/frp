import Database from "better-sqlite3";
import { fileURLToPath } from "node:url";
import path from "node:path";

// __dirname does not exist in ESM, get from import.meta.url instead
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, "..", "data", "auth.db");

const db = new Database(dbPath);

// Create user table
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export default db;