const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user-info')
		.setDescription('Get your user info.'),
	async execute(interaction) {
		await interaction.reply(`\`\`\`yaml\nYour tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}\n\`\`\``);
	},
};