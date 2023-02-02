const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('server-info')
		.setDescription('Get the server info.'),
	async execute(interaction) {
		await interaction.reply(`\`\`\`yaml\nServer name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}\n\`\`\``);
	},
};