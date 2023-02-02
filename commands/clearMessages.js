const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('Clear the messages from this chat.'),
	async execute(interaction) {
		try {
			interaction.channel.bulkDelete(100, true);
			await interaction.reply('The messages were cleared!');
		}
		catch (err) {
			console.error(err);
		}

	},
};