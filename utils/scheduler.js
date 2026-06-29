const { EmbedBuilder } = require('discord.js');
const dataManager = require('./dataManager');

let checkInterval = null;

// Helper to generate IDs
function generateRoomDetails() {
    const roomId = Math.floor(1000000 + Math.random() * 9000000).toString();
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Avoid ambiguous chars
    let password = '';
    for (let i = 0; i < 5; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return { roomId, password };
}

// Extraction regex parser for channel matchings (e.g., group-1, ux-group-1, etc)
function extractGroupNumber(channelName) {
    const match = channelName.toLowerCase().match(/group-(\d+)/);
    return match ? parseInt(match[1], 10) : null;
}

async function checkGuildSchedules(client) {
    const allRuntime = dataManager.getAllRuntime();

    for (const guildId of Object.keys(allRuntime)) {
        const runtime = allRuntime[guildId];
        if (!runtime.active) continue;

        const guild = client.guilds.cache.get(guildId);
        if (!guild) continue;

        const config = dataManager.getConfig(guildId);
        if (!config.categoryId) continue;

        const schedule = dataManager.getSchedule(guildId);
        if (!schedule.length) continue;

        const now = new Date();
        const sentList = runtime.sentMatches || [];
        let updatedSentList = [...sentList];

        for (const item of schedule) {
            const idpTime = new Date(item.idp);
            // Unique identifier for duplicate match detection tracking
            const matchKey = `${item.group}-${item.match}-${item.idp}`;

            if (now >= idpTime && !sentList.includes(matchKey)) {
                try {
                    const category = guild.channels.cache.get(config.categoryId);
                    if (!category) continue;

                    // Match matching groups directly underneath the targeted Category
                    const targetChannel = guild.channels.cache.find(c => 
                        c.parentId === category.id && 
                        extractGroupNumber(c.name) === parseInt(item.group, 10)
                    );

                    if (targetChannel) {
                        const { roomId, password } = generateRoomDetails();
                        const formattedStartTime = `<t:${Math.floor(new Date(item.start).getTime() / 1000)}:F>`;

                        const embed = new EmbedBuilder()
                            .setColor(0x00FF00)
                            .setTitle('🏆 Tournament ID Password')
                            .setDescription(
                                `**Group:** Group ${item.group}\n` +
                                `**Match:** Match ${item.match}\n\n` +
                                `**Room ID:** ${roomId}\n` +
                                `**Password:** ${password}\n\n` +
                                `**Start Time:** ${formattedStartTime}`
                            )
                            .setFooter({ text: 'Good Luck' })
                            .setTimestamp();

                        await targetChannel.send({ embeds: [embed] });
                        updatedSentList.push(matchKey);
                    }
                } catch (err) {
                    console.error(`Error processing IDP for guild ${guildId}:`, err);
                }
            }
        }

        if (updatedSentList.length !== sentList.length) {
            dataManager.saveRuntime(guildId, { sentMatches: updatedSentList });
        }
    }
}

function startScheduler(client) {
    if (checkInterval) clearInterval(checkInterval);
    checkInterval = setInterval(() => checkGuildSchedules(client), 5000);
    console.log('Scheduler loop tracking global lists execution routine status: Active');
}

module.exports = { 
    startScheduler };
