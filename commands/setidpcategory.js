const fs = require("fs");

const path = "./data/config.json";

const {
SlashCommandBuilder,
ChannelType
} = require("discord.js");

module.exports = {

data: new SlashCommandBuilder()

.setName("setidpcategory")

.setDescription("Set IDP Category")

.addChannelOption(option =>

option

.setName("category")

.setDescription("Select Category")

.addChannelTypes(ChannelType.GuildCategory)

.setRequired(true)

),

async execute(interaction) {

const category =
interaction.options.getChannel("category");

let data = {};

if (fs.existsSync(path)) {

data = JSON.parse(
fs.readFileSync(path)
);

}

data[interaction.guild.id] = {

categoryId: category.id

};

fs.writeFileSync(
path,
JSON.stringify(data, null, 2)
);

await interaction.reply({

content:
`✅ IDP Category Set To **${category.name}**`

});

}

};
