const fs = require("fs");
const path = require("path");

const {
    SlashCommandBuilder,
    AttachmentBuilder
} = require("discord.js");

const schedulePath = path.join(__dirname, "..", "data", "schedule.json");

module.exports = {

    data: new SlashCommandBuilder()

        .setName("setschedule")

        .setDescription("Upload Schedule JSON")

        .addAttachmentOption(option =>
            option
            .setName("file")
            .setDescription("schedule.json")
            .setRequired(true)
        ),

    async execute(interaction) {

        const attachment =
            interaction.options.getAttachment("file");

        if (!attachment.name.endsWith(".json")) {

            return interaction.reply({

                content: "❌ Please upload a JSON file.",

                ephemeral: true

            });

        }

        const res = await fetch(attachment.url);

        const json = await res.json();

        let allSchedules = {};

        if (fs.existsSync(schedulePath)) {

            allSchedules = JSON.parse(

                fs.readFileSync(schedulePath)

            );

        }

        allSchedules[interaction.guild.id] = json;

        fs.writeFileSync(

            schedulePath,

            JSON.stringify(allSchedules, null, 2)

        );

        await interaction.reply({

            content:
            `✅ Schedule Loaded Successfully.\nMatches : **${json.length}**`

        });

    }

};
