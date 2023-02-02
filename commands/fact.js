const { SlashCommandBuilder } = require('@discordjs/builders');
const { facts } = require('../fact.json');
const factCount = facts.length - 1;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('fact')
		.setDescription('Lemme give ya a fact!'),
	async execute(interaction) {
		await interaction.reply('```fix\n' + facts[Math.round(Math.random() * factCount)] + '\n```');
	},
};