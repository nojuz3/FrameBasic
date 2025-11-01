const Database = require("better-sqlite3");
const bcrypt = require("bcrypt");
const db = new Database(process.env.DB_FILE || "database.db");


db.prepare(
  `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT DEFAULT 'user' CHECK(role IN ('admin', 'user'))
  )
`
).run();

db.prepare(
  `CREATE TABLE IF NOT EXISTS festivals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT,
    date TEXT,
    location TEXT,
    ticketPrice REAL,
    capacity INTEGER,
    category TEXT,
    image TEXT,
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )
`
).run();

db.prepare(
  `CREATE TABLE IF NOT EXISTS pending (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    date TEXT NOT NULL,
    location TEXT NOT NULL,
    ticketPrice INTEGER NOT NULL,
    capacity INTEGER NOT NULL,
    category TEXT NOT NULL,
    image TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id)
  )
`
).run();


(async () => {
  const userExists = db
    .prepare("SELECT * FROM users WHERE username = ?")
    .get("admin");

  if (!userExists) {
    const adminpass = await bcrypt.hash("admin123", 10);
    db.prepare(
      "INSERT INTO users (username,email ,password, role) VALUES (?, ?, ?, ?)"
    ).run("admin", "admin@mail.com", adminpass, "admin");
  }
})();

// db.prepare("INSERT INTO pages (title, slug) VALUES(?,?)").run("test","test")
// db.prepare(`DROP TABLE IF EXISTS festivals`).run();
// db.prepare("DELETE FROM pages WHERE id = 2").run()

module.exports = db;