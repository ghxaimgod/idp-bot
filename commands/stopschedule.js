const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const dataManager = require('../utils/dataManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stopschedule')
        .setDescription('Stops the automatic background checker routine loops for updates updates processing.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        dataManager.saveRuntime(interaction.guildId, { active: false });
        await interaction.reply({ content: '⏸️ Automatic background tracker updates execution routine module has been **Stopped**.', ephemeral: true });
    }
};
