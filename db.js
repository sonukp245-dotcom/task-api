
const Database = require("better-sqlite3");

// Create or open the database
const db = new Database("tasks.db");

// Create table if it does not exist
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    done INTEGER NOT NULL DEFAULT 0
  )
`);

// Insert sample tasks only if the table is empty
const result = db
  .prepare("SELECT COUNT(*) AS total FROM tasks")
  .get();

if (result.total === 0) {
  const insert = db.prepare(
    "INSERT INTO tasks (title, done) VALUES (?, ?)"
  );

  const insertSamples = db.transaction(() => {
    insert.run("Learn JavaScript", 0);
    insert.run("Build an API", 0);
    insert.run("Test the API", 1);
  });

  insertSamples();
}

console.log("Database initialized successfully!");

module.exports = db;
