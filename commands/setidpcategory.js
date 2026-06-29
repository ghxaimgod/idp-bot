const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const dataManager = require('../utils/dataManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setidpcategory')
        .setDescription('Set the Tournament Category where Group Channels exist.')
        .addChannelOption(option => 
            option.setName('category')
                .setDescription('Select the target category channel')
                .addChannelTypes(ChannelType.GuildCategory)
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const category = interaction.options.getChannel('category');
        dataManager.saveConfig(interaction.guildId, { categoryId: category.id });
        
        await interaction.reply({ content: `✅ Successfully set targeting updates category target to **${category.name}**!`, ephemeral: true });
    }
};
