const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const dataManager = require('../utils/dataManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nextidp')
        .setDescription('Shows the next pending entry match element data array trace configuration queue.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const schedule = dataManager.getSchedule(interaction.guildId);
        const runtime = dataManager.getRuntime(interaction.guildId);
        const sentMatches = runtime.sentMatches || [];

        const upcoming = schedule
            .filter(item => !sentMatches.includes(`${item.group}-${item.match}-${item.idp}`))
            .sort((a, b) => new Date(a.idp) - new Date(b.idp));

        if (!upcoming.length) {
            return interaction.reply({ content: '🔍 Clear: There are currently no upcoming matches configured within active tracker runtime logs queues.', ephemeral: true });
        }

        const next = upcoming[0];
        const idpTimestamp = Math.floor(new Date(next.idp).getTime() / 1000);
        const startTimestamp = Math.floor(new Date(next.start).getTime() / 1000);

        const embed = new EmbedBuilder()
            .setColor(0x3498DB)
            .setTitle('⏳ Next Programmed IDP Configuration details')
            .addFields(
                { name: 'Group Profile Target', value: `Group ${next.group}`, inline: true },
                { name: 'Match Target ID', value: `Match ${next.match}`, inline: true },
                { name: 'IDP Broadcast Window Time', value: `<t:${idpTimestamp}:F> (<t:${idpTimestamp}:R>)` },
                { name: 'Tournament Core Match Start', value: `<t:${startTimestamp}:F> (<t:${startTimestamp}:R>)` }
            );

        await interaction.reply({ embeds: [embed], ephemeral: true });
   
    }
};
