const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('delete')
		.setDescription('Delete chat and recreate it.'),
	async execute(interaction) {
		try {
			interaction.channel.clone();
			interaction.channel.delete();
		}
		catch (err) {
			console.error(err);
		}

	},
};