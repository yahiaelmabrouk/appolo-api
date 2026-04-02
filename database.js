const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, 'tasks.db');

const db = new sqlite3.Database(DB_PATH);

function initDatabase() {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run(`
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT NOT NULL
                )
            `);

            db.run(`
                CREATE TABLE IF NOT EXISTS tasks (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    title TEXT NOT NULL,
                    description TEXT NOT NULL,
                    completed BOOLEAN NOT NULL DEFAULT 0,
                    duration INTEGER NOT NULL,
                    userId INTEGER,
                    FOREIGN KEY (userId) REFERENCES users(id)
                )
            `);

            // Seed default data if tables are empty
            db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
                if (err) return reject(err);
                if (row.count === 0) {
                    db.run('INSERT INTO users (username) VALUES (?)', ['john_doe']);
                    db.run('INSERT INTO users (username) VALUES (?)', ['jane_doe']);

                    db.run('INSERT INTO tasks (title, description, completed, duration, userId) VALUES (?, ?, ?, ?, ?)',
                        ['Front-end development for e-commerce websites', 'Create a responsive user interface using React and Redux for an e-commerce website.', 0, 120, 1]);
                    db.run('INSERT INTO tasks (title, description, completed, duration, userId) VALUES (?, ?, ?, ?, ?)',
                        ['Back-end development for user authentication', 'Implement an authentication and authorization system for a web application using Node.js, Express, and Passport.js', 0, 90, 2]);
                    db.run('INSERT INTO tasks (title, description, completed, duration, userId) VALUES (?, ?, ?, ?, ?)',
                        ['Testing and Quality Assurance for Web Applications', 'Develop and execute complete test plans and test cases.', 0, 60, 1], (err) => {
                            if (err) return reject(err);
                            resolve();
                        });
                } else {
                    resolve();
                }
            });
        });
    });
}

// Helper to promisify db methods
function dbAll(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

function dbGet(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}

function dbRun(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) reject(err);
            else resolve({ lastID: this.lastID, changes: this.changes });
        });
    });
}

module.exports = { db, initDatabase, dbAll, dbGet, dbRun };
