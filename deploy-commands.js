require("dotenv").config();

const {
    REST,
    Routes,
    SlashCommandBuilder
} = require("discord.js");

const commands = [

new SlashCommandBuilder()
.setName("setidpcategory")
.setDescription("Set IDP Category")
.addChannelOption(option =>
option
.setName("category")
.setDescription("Select Category")
.setRequired(true)
),

new SlashCommandBuilder()
.setName("setschedule")
.setDescription("Upload Schedule"),

new SlashCommandBuilder()
.setName("startschedule")
.setDescription("Start IDP Scheduler"),

new SlashCommandBuilder()
.setName("stopschedule")
.setDescription("Stop IDP Scheduler"),

new SlashCommandBuilder()
.setName("nextidp")
.setDescription("View Next IDP"),

];

const rest = new REST({
version: "10"
}).setToken(process.env.TOKEN);

(async () => {

try {

console.log("Registering Slash Commands...");

await rest.put(

Routes.applicationCommands(
process.env.CLIENT_ID
),

{
body: commands
}

);

console.log("Commands Registered Successfully ✅");

} catch (err) {

console.log(err);

}

})();
