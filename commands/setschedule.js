const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const dataManager = require('../utils/dataManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setschedule')
        .setDescription('Upload a tournament schedule tracking file (.json format)')
        .addAttachmentOption(option => 
            option.setName('file')
                .setDescription('The structural schedule setup config file')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const file = interaction.options.getAttachment('file');
        
        if (!file.name.endsWith('.json')) {
            return interaction.reply({ content: '❌ Invalid File format validation error. Please attach a valid structural `.json` array list tracker layout profile file.', ephemeral: true });
        }

        await interaction.deferReply({ ephemeral: true });

        try {
            const response = await fetch(file.url);
            const data = await response.json();

            if (!Array.isArray(data)) {
                return interaction.editReply({ content: '❌ Structural validation error: Root element must be an array map wrapper profile setup.' });
            }

            for (const item of data) {
                if (item.group === undefined || item.match === undefined || !item.idp || !item.start) {
                    return interaction.editReply({ content: '❌ Formatting Error: Objects must match `{"group":1, "match":1, "idp":"...", "start":"..."}` structure validation.' });
                }
            }

            dataManager.saveSchedule(interaction.guildId, data);
            await interaction.editReply({ content: `✅ Loaded scheduling array list profile map update: successfully tracked **${data.length}** event items.` });
        } catch (error) {
            await interaction.editReply({ content: '❌ Error reading configuration. Check JSON file structural styling syntax compilation validation.' });
        }
   
    }
};
