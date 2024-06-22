const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'screenshots.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS screenshots (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp INTEGER,
        filePath TEXT
    )`);
});

function insertScreenshot(timestamp, filePath) {
    db.run(
        'INSERT INTO screenshots (timestamp, filePath) VALUES (?, ?)',
        [timestamp, filePath]
    );
}

function getAllScreenshots(callback) {
    db.all('SELECT * FROM screenshots', [], (err, rows) => {
        callback(err, rows);
    });
}

function getTimestamps(callback) {
    db.all('SELECT timestamp FROM screenshots ORDER BY timestamp DESC', [], (err, rows) => {
        const timestamps = rows.map(row => row.timestamp);
        callback(err, timestamps);
    });
}

module.exports = {
    insertScreenshot,
    getAllScreenshots,
    getTimestamps
};
