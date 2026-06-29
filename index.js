require("dotenv").config();

const fs = require("fs");
const path = require("path");

const {
    Client,
    GatewayIntentBits,
    Collection
} = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds
    ]
});

client.commands = new Collection();

/* ===========================
   Load Commands
=========================== */

const commandsPath = path.join(__dirname, "commands");

if (fs.existsSync(commandsPath)) {
    const commandFiles = fs
        .readdirSync(commandsPath)
        .filter(file => file.endsWith(".js"));

    for (const file of commandFiles) {
        const command = require(path.join(commandsPath, file));

        client.commands.set(command.data.name, command);
    }
}

/* ===========================
   Ready Event
=========================== */

client.once("ready", () => {

    console.log(`${client.user.tag} is Online ✅`);

});

/* ===========================
   Slash Commands
=========================== */

client.on("interactionCreate", async interaction => {

    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {

        await command.execute(interaction, client);

    } catch (err) {

        console.error(err);

        if (interaction.replied || interaction.deferred) {

            interaction.followUp({
                content: "❌ Error while executing command.",
                ephemeral: true
            });

        } else {

            interaction.reply({
                content: "❌ Error while executing command.",
                ephemeral: true
            });

        }

    }

});

client.login(process.env.TOKEN);
