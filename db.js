const sqlite3 = require('sqlite3').verbose();

// Initialize Database
const db = new sqlite3.Database('./recordings.db', (err) => {
  if (err) {
    console.error('Failed to connect to SQLite:', err.message);
  } else {
    console.log('✅ Connected to the SQLite database.');
  }
});

// Create Recordings Table
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS recordings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      room_id TEXT,
      file_name TEXT,
      file_path TEXT,
      uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

module.exports = db;
