const fs = require('fs');
const path = require('path');

const CONFIG_PATH = path.join(__dirname, '../data/config.json');
const SCHEDULE_PATH = path.join(__dirname, '../data/schedule.json');
const RUNTIME_PATH = path.join(__dirname, '../data/runtime.json');

// Ensure database files exist
function initDatabase() {
    const dir = path.join(__dirname, '../data');
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(CONFIG_PATH)) fs.writeFileSync(CONFIG_PATH, JSON.stringify({}));
    if (!fs.existsSync(SCHEDULE_PATH)) fs.writeFileSync(SCHEDULE_PATH, JSON.stringify({}));
    if (!fs.existsSync(RUNTIME_PATH)) fs.writeFileSync(RUNTIME_PATH, JSON.stringify({}));
}

function readJSON(filePath) {
    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (error) {
        return {};
    }
}

function writeJSON(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

module.exports = {
    initDatabase,
    
    getConfig: (guildId) => readJSON(CONFIG_PATH)[guildId] || {},
    saveConfig: (guildId, data) => {
        const config = readJSON(CONFIG_PATH);
        config[guildId] = { ...config[guildId], ...data };
        writeJSON(CONFIG_PATH, config);
    },

    getSchedule: (guildId) => readJSON(SCHEDULE_PATH)[guildId] || [],
    saveSchedule: (guildId, list) => {
        const schedule = readJSON(SCHEDULE_PATH);
        schedule[guildId] = list;
        writeJSON(SCHEDULE_PATH, schedule);
    },

    getRuntime: (guildId) => readJSON(RUNTIME_PATH)[guildId] || {},
    saveRuntime: (guildId, data) => {
        const runtime = readJSON(RUNTIME_PATH);
        runtime[guildId] = { ...runtime[guildId], ...data };
        writeJSON(RUNTIME_PATH, runtime);
    },
    
    // Yahan par problem thi, ab ye bilkul correct hai:
    getAllRuntime: () => readJSON(RUNTIME_P
                                  ATH)
};
