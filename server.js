const express = require('express');
const path = require('path');
const fs = require('fs');
const { getAllScreenshots, getTimestamps } = require('./screenshotDatabase');
const { searchEntries } = require('./recallDatabase');
const { humanReadableTime, timestampToHumanReadable } = require('./utils');

const app = express();
const screenshotsPath = path.join(__dirname, 'screenshots');
const stylesPath = path.join(__dirname, 'styles.css');
const indexPath = path.join(__dirname, 'index.html');
const scriptsPath = path.join(__dirname, 'scripts.js');

app.use('/static', express.static(screenshotsPath));
app.use('/styles.css', express.static(stylesPath));
app.use('/scripts.js', express.static(scriptsPath));

app.get('/', (req, res) => {
    res.sendFile(indexPath);
});

app.get('/timestamps', (req, res) => {
    getTimestamps((err, timestamps) => {
        if (err) {
            return res.status(500).send('Error retrieving timestamps');
        }
        res.json(timestamps);
    });
});

app.get('/images/:timestamp', (req, res) => {
    const timestamp = req.params.timestamp;
    const files = fs.readdirSync(screenshotsPath).filter(file => file.startsWith(timestamp.toString()));
    res.json(files);
});

app.get('/search', (req, res) => {
    const query = req.query.q;
    searchEntries(query, (err, entries) => {
        if (err) {
            return res.status(500).send('Error retrieving entries');
        }
        res.json(entries);
    });
});

const PORT = 8082;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
