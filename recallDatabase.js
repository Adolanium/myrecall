const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'recall.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        text TEXT,
        timestamp INTEGER,
        filePath TEXT,
        app TEXT,
        title TEXT
    )`);
});

function insertEntry(text, timestamp, filePath, app, title) {
    db.run(
        'INSERT INTO entries (text, timestamp, filePath, app, title) VALUES (?, ?, ?, ?, ?)',
        [text, timestamp, filePath, app, title]
    );
}

function searchEntries(query, callback) {
    db.all('SELECT * FROM entries WHERE text LIKE ?', [`%${query}%`], (err, rows) => {
        callback(err, rows);
    });
}

module.exports = {
    insertEntry,
    searchEntries
};
