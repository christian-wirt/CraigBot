const { SlashCommandBuilder } = require('@discordjs/builders');
const playMusic = require('./playMusic.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('get-queue')
		.setDescription('See the queue.'),
	async execute(interaction) {
		const musicArray = playMusic.getQueue();
		await interaction.reply(musicArray);
	},
};