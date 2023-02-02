const { SlashCommandBuilder } = require('@discordjs/builders');
const { createAudioPlayer, createAudioResource, joinVoiceChannel, AudioPlayerStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const playMusic = require('./playMusic.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('next')
		.setDescription('Play the next song from the queue.'),
	async execute(interaction) {

		const channel = interaction.member.voice.channel;
		const username = interaction.user.username;

		if (!channel) {
			interaction.reply(`${username}, join a voice channel :D`);
			return;
		}

		const array = playMusic.getQueue();
		console.log(`Length of queue: ${array.length}`);

		if (!array.length || array.length < 2) {
			interaction.reply('There are no songs in the queue.');
		}

		// Move to next song in the queue
		else {

			const player = createAudioPlayer();
			let resource = '';
			let connection;

			const createStream = (str) => {
				try {
					resource = createAudioResource(ytdl(str, {
						filter: 'audioonly',
						fmt: 'mp3',
						opusEncoded: false,
						encoderArgs: ['-af', 'bass=g=10,dynaudnorm=f=200'],
						highWaterMark: 1 << 25,
					}));

					// Set up voice channel connection
					connection = joinVoiceChannel({
						channelId: channel.id,
						guildId: channel.guild.id,
						adapterCreator: channel.guild.voiceAdapterCreator,
					});

					// Join channel and play voice
					connection.subscribe(player);
					player.play(resource);

				}
				catch (err) {
					console.error(err);
				}
			};

			array.shift();
			const url = array[0];
			const queue = array.length - 1;
			createStream(url);
			interaction.reply(`Playing the next song: ${url}\nAmount of songs left in the queue: ${queue}`);

			player.on('error', error => {
				console.error(`Error: ${error.message}`);
			});

			player.on('stateChange', (oldState, newState) => {
				console.log(`Audio player transitioned from ${oldState.status} to ${newState.status}`);
			});

			// Play the next song in the queue after the original song finishes
			player.on(AudioPlayerStatus.Idle, () => {
				array.shift();
				// If it's the last song in the queue, disconnect the bot
				if (connection && !array.length) {
					connection.destroy();
				}

				// If there's another song in the queue, play the first one
				else if (array.length) {
					createStream(array[0]);
				}
			});

			// If a user disconnects/moves the bot, clear the queue
			player.on(AudioPlayerStatus.AutoPaused, () => {
				if (array.length) {
					array.length = 0;
				}
			});
		}

	},
};