const { SlashCommandBuilder } = require('@discordjs/builders');
const playMusic = require('./playMusic.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clear-queue')
		.setDescription('Delete the entire queue.'),
	async execute(interaction) {
		const musicArray = playMusic.getQueue();
		if (musicArray) {
			musicArray.length = 0;
			await interaction.reply('The queue has been cleared.');
		}
		else {
			await interaction.reply('There are no songs in the queue! Command could not be run.');
		}
	},
};