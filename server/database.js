const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

// Connect to SQLite Database
const dbPath = path.resolve(__dirname, 'medivia.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database ' + dbPath + ': ' + err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Initialize Schema
db.serialize(() => {
    // 1. Users Table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // 2. Password Reset Tokens Table
    db.run(`CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        token_hash TEXT NOT NULL,
        expires_at DATETIME NOT NULL,
        used_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )`);

    // 3. Seed Test User (if not exists)
    // Email: user123@example.com, Password: Password123!
    const testEmail = 'user123@example.com';
    db.get("SELECT id FROM users WHERE email = ?", [testEmail], async (err, row) => {
        if (!row) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('Password123!', salt);

            const insertStmt = db.prepare("INSERT INTO users (email, password, name) VALUES (?, ?, ?)");
            insertStmt.run(testEmail, hashedPassword, 'Test User');
            insertStmt.finalize();
            console.log(`Seeded test user: ${testEmail}`);
        }
    });

    // Seed Admin User (for testing the flow requested earlier)
    const adminEmail = 'ahmedmakled2004@gmail.com';
    db.get("SELECT id FROM users WHERE email = ?", [adminEmail], async (err, row) => {
        if (!row) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('AdminPass123!', salt);

            const insertStmt = db.prepare("INSERT INTO users (email, password, name) VALUES (?, ?, ?)");
            insertStmt.run(adminEmail, hashedPassword, 'System Admin');
            insertStmt.finalize();
            console.log(`Seeded admin user: ${adminEmail}`);
        }
    });

});

module.exports = db;
