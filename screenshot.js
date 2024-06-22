const screenshot = require('screenshot-desktop');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const Tesseract = require('tesseract.js');

const screenshotsPath = path.join(__dirname, 'screenshots');
const langDataPath = path.join(__dirname, 'lang-data');

if (!fs.existsSync(screenshotsPath)) {
    fs.mkdirSync(screenshotsPath);
}

async function captureScreenshot() {
    const timestamp = Date.now();
    const filePaths = [];

    try {
        const images = await screenshot.all();
        for (let i = 0; i < images.length; i++) {
            const imgBuffer = images[i];
            const imgPath = path.join(screenshotsPath, `${timestamp}_${i}.jpeg`);
            
            await sharp(imgBuffer)
                .jpeg()
                .toFile(imgPath);
            
            filePaths.push(imgPath);
        }
        return { timestamp, filePaths };
    } catch (err) {
        console.error('Error capturing screenshot:', err);
        return null;
    }
}

async function performOCR(filePath) {
    try {
        const { data: { text } } = await Tesseract.recognize(filePath, 'eng+heb', {
            langPath: langDataPath,
        });
        return text;
    } catch (err) {
        console.error('Error performing OCR:', err);
        return '';
    }
}

module.exports = { captureScreenshot, performOCR };
