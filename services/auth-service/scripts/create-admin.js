import { createInterface } from "node:readline/promises";
import db from "../src/db.js";
import { hashPassword } from "../src/password.js";

const rl = createInterface({ input: process.stdin, output: process.stdout });

try {
  const username = await rl.question("Admin-Username: ");
  const password = await rl.question("Admin-Passwort: ");

  if (!username || !password) {
    console.error("Username und Passwort duerfen nicht leer sein.");
    process.exit(1);
  }

  const passwordHash = await hashPassword(password);

  const insert = db.prepare(
    "INSERT INTO users (username, password_hash) VALUES (?, ?)"
  );
  insert.run(username, passwordHash);

  console.log(`Admin-User "${username}" wurde angelegt.`);
} catch (err) {
  if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
    console.error("Dieser Username existiert bereits.");
  } else {
    console.error("Fehler beim Anlegen des Admin-Users:", err.message);
  }
  process.exit(1);
} finally {
  rl.close();
}