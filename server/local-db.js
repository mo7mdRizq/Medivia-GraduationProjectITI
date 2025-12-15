const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_FILE = path.resolve(__dirname, 'db.json');

// Initialize DB file if not exists
if (!fs.existsSync(DB_FILE)) {
    const initialData = {
        users: [],
        password_reset_tokens: [] // { id, userId, tokenHash, expiresAt, usedAt, createdAt }
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));

    // Seed DB
    const seed = async () => {
        const db = JSON.parse(fs.readFileSync(DB_FILE));
        const salt = await bcrypt.genSalt(10);

        // Test User
        const hash1 = await bcrypt.hash('Password123!', salt);
        db.users.push({
            id: 1,
            email: 'user123@example.com',
            password: hash1,
            name: 'Test User',
            created_at: new Date().toISOString()
        });

        // Admin User
        const hash2 = await bcrypt.hash('AdminPass123!', salt);
        db.users.push({
            id: 2,
            email: 'ahmedmakled2004@gmail.com',
            password: hash2,
            name: 'System Admin',
            created_at: new Date().toISOString()
        });

        fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
        console.log("Database seeded with JSON storage.");
    };
    seed();
}

// Helper to read/write
const readDB = () => JSON.parse(fs.readFileSync(DB_FILE));
const writeDB = (data) => fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

const db = {
    users: {
        findByEmail: (email) => {
            const data = readDB();
            return data.users.find(u => u.email === email);
        },
        updatePassword: (id, hashedPassword) => {
            const data = readDB();
            const user = data.users.find(u => u.id === id);
            if (user) {
                user.password = hashedPassword;
                writeDB(data);
                return true;
            }
            return false;
        }
    },
    tokens: {
        create: (userId, tokenHash, expiresAt) => {
            const data = readDB();
            const newToken = {
                id: data.password_reset_tokens.length + 1,
                user_id: userId,
                token_hash: tokenHash,
                expires_at: expiresAt,
                used_at: null,
                created_at: new Date().toISOString()
            };
            data.password_reset_tokens.push(newToken);
            writeDB(data);
            return newToken;
        },
        findValid: (tokenHash) => {
            const data = readDB();
            return data.password_reset_tokens.find(t =>
                t.token_hash === tokenHash &&
                t.used_at === null &&
                new Date(t.expires_at) > new Date()
            );
        },
        markUsed: (id) => {
            const data = readDB();
            const token = data.password_reset_tokens.find(t => t.id === id);
            if (token) {
                token.used_at = new Date().toISOString();
                writeDB(data);
            }
        }
    }
};

module.exports = db;
