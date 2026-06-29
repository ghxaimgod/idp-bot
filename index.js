// Default Server Timezone set to India (IST)
process.env.TZ = 'Asia/Kolkata';

const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const http = require('http'); // Added for dummy server
require('dotenv').config();

const dataManager = require('./utils/dataManager');
const { startScheduler } = require('./utils/scheduler');

// Initialize database tracking folders and configuration logs components
dataManager.initDatabase();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages
    ]
});

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    }
}

client.once('ready', () => {
    console.log(`Successfully configured system connection trace framework logs active interface profiles targets. Authenticated as: ${client.user.tag}`);
    // Start automatic scheduler routines processing engines sequence loops allocation tracking mapping operations rules
    startScheduler(client);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(`Command routing operational deployment processing error executing command system trace logs sequence maps layout rules ${interaction.commandName}:`, error);
        const errorPayload = { content: 'There was an error while executing this command!', ephemeral: true };
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp(errorPayload);
        } else {
            await interaction.reply(errorPayload);
        }
    }
});

// Safeguards for process runtime
process.on('unhandledRejection', error => console.error('Unhandled promise rejection:', error));
process.on('uncaughtException', error => console.error('Uncaught Exception:', error));

// Dummy server to satisfy Railway's web service health check rules
const server = http.createServer((req, res) => {
   res.writeHead(200, { 'Content-Type': 'text/plain' });
   res.end('Bot is alive and running!\n');
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
   console.log(`Health-check server successfully running on port ${PORT}`);
});

client.login(process.env.DISCORD_TOKEN);
