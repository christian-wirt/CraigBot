const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const commands = [];

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Get help!'),
	async execute(interaction) {
		try {
			let text = '';
			commands.length = 0;
			commandFiles.forEach(file => {
				const command = require(`./${file}`);
				commands.push(command);
			});
			commands.forEach(command => {
				text = text.concat(`${command.data.name}: ${command.data.description}\n`);
			});
			await interaction.reply(`\`\`\`yaml\nAvailable commands:\n${text}\`\`\``);

		}
		catch (err) {
			console.error(err);
		}

	},
};