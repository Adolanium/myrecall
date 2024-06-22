const { execSync } = require('child_process');

function humanReadableTime(timestamp) {
    const now = new Date();
    const dtObject = new Date(timestamp);
    const diff = now - dtObject;
    const diffInSeconds = Math.floor(diff / 1000);

    if (diffInSeconds >= 86400) { // days
        const diffInDays = Math.floor(diffInSeconds / 86400);
        return `${diffInDays} days ago`;
    } else if (diffInSeconds < 60) {
        return `${diffInSeconds} seconds ago`;
    } else if (diffInSeconds < 3600) {
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        return `${diffInMinutes} minutes ago`;
    } else {
        const diffInHours = Math.floor(diffInSeconds / 3600);
        return `${diffInHours} hours ago`;
    }
}

function timestampToHumanReadable(timestamp) {
    try {
        const dtObject = new Date(timestamp);
        return dtObject.toISOString().replace('T', ' ').substr(0, 19);
    } catch (error) {
        return "";
    }
}

function getActiveAppNameWindows() {
    try {
        const output = execSync('powershell.exe -Command "(Get-Process | Where-Object { $_.MainWindowHandle -ne 0 } | Sort-Object CPU -Descending | Select-Object -First 1).Name"').toString();
        return output.trim();
    } catch (error) {
        console.error('Error getting active app name:', error);
        return "";
    }
}

function getActiveWindowTitleWindows() {
    try {
        const output = execSync('powershell.exe -Command "(Get-Process | Where-Object { $_.MainWindowHandle -ne 0 } | Sort-Object CPU -Descending | Select-Object -First 1).MainWindowTitle"').toString();
        return output.trim();
    } catch (error) {
        console.error('Error getting active window title:', error);
        return "";
    }
}

function getActiveAppName() {
    return getActiveAppNameWindows();
}

function getActiveWindowTitle() {
    return getActiveWindowTitleWindows();
}

function isUserActive() {
    return true;
}

module.exports = {
    humanReadableTime,
    timestampToHumanReadable,
    getActiveAppName,
    getActiveWindowTitle,
    isUserActive
};
