const fs = require('fs');
const path = require('path');
const { recordScreenshots, performOCRBatch } = require('./recorder');

const dataPath = path.join(__dirname, 'data');
if (!fs.existsSync(dataPath)) {
    fs.mkdirSync(dataPath);
}

recordScreenshots();
performOCRBatch();

require('./server');
