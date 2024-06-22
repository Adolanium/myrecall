const { captureScreenshot } = require('./screenshot');
const { insertScreenshot } = require('./screenshotDatabase');
const { performOCR } = require('./screenshot');
const { insertEntry } = require('./recallDatabase');
const { getActiveWindowTitle, getActiveAppName } = require('./utils');
const fs = require('fs');
const path = require('path');

async function recordScreenshots() {
    while (true) {
        const screenshotResult = await captureScreenshot();
        if (!screenshotResult) {
            console.error('Failed to capture screenshot');
            await new Promise(resolve => setTimeout(resolve, 3000));
            continue;
        }

        const { timestamp, filePaths } = screenshotResult;
        filePaths.forEach(filePath => insertScreenshot(timestamp, filePath));

        await new Promise(resolve => setTimeout(resolve, 3000));
    }
}

async function performOCRBatch() {
    const screenshotsPath = path.join(__dirname, 'screenshots');
    while (true) {
        const files = fs.readdirSync(screenshotsPath).filter(file => file.endsWith('.jpeg'));
        for (const file of files) {
            const filePath = path.join(screenshotsPath, file);
            const timestamp = parseInt(file.split('_')[0]);

            const text = await performOCR(filePath);
            const app = getActiveAppName();
            const title = getActiveWindowTitle();
            insertEntry(text, timestamp, filePath, app, title);
        }

        await new Promise(resolve => setTimeout(resolve, 100));
    }
}

module.exports = { recordScreenshots, performOCRBatch };
