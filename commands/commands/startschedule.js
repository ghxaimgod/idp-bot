const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const dataManager = require('../utils/dataManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('startschedule')
        .setDescription('Starts processing active database item allocations for scheduled releases.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const config = dataManager.getConfig(interaction.guildId);
        if (!config.categoryId) {
            return interaction.reply({ content: '❌ Error: Configure setup parameters first. Please bind a target system channel block profile via `/setidpcategory`.', ephemeral: true });
        }

        dataManager.saveRuntime(interaction.guildId, { active: true });
        await interaction.reply({ content: '▶️ Automatic background tracker updates execution routine module has been **Started**.', ephemeral: true });
    }
}
  ;
