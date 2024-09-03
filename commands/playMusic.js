const { SlashCommandBuilder } = require('@discordjs/builders');
const { createAudioPlayer, createAudioResource, joinVoiceChannel, AudioPlayerStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');

// Music queue to play music from
const musicArray = [];

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Imma spit you a song off the dome piece :p')
		.addStringOption(option =>
			option.setName('link')
				.setDescription('The song to play!')
				.setRequired(true)),
	getQueue() {
		return musicArray;
	},
	async execute(interaction) {

		// Voice channel, username, and parameter to pass
		const channel = interaction.member.voice.channel;
		const username = interaction.user.username;
		const song = interaction.options.data[0].value;

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

				console.log('playing');

				const networkStateChangeHandler = (oldNetworkState, newNetworkState) => {
					const newUdp = Reflect.get(newNetworkState, 'udp');
					clearInterval(newUdp?.keepAliveInterval);
				};

				connection.on('stateChange', (oldState, newState) => {
					const oldNetworking = Reflect.get(oldState, 'networking');
					const newNetworking = Reflect.get(newState, 'networking');

					oldNetworking?.off('stateChange', networkStateChangeHandler);
					newNetworking?.on('stateChange', networkStateChangeHandler);
				});

			}
			catch (err) {
				console.error(err);
			}
		};

		async function playSong(str) {

			if (!channel) {
				interaction.reply(`${username}, join a voice channel :D`);
				return;
			}

			// If a URL is passed
			if (ytdl.validateURL(str)) {
				musicArray.push(str);
				console.log(musicArray);
				if (musicArray.length === 1) {
					interaction.reply(`${username} played a stream: ${str}`);
					createStream(str);

				}
				else {
					// console.log(queueNumber);
					interaction.reply(`${username} added a stream to the queue: ${str}\nPosition in queue: ${musicArray.length - 1}`);
				}
			}
			// If a query is passed rather than a URL
			else {
				const result = await ytSearch(str);
				const video = result.videos.slice(0, 1).shift();
				musicArray.push(video.url);
				if (musicArray.length === 1) {
					interaction.reply(`${username} played a stream: ${video.url}`);
					createStream(video.url);
				}
				else {
					interaction.reply(`${username} added a stream to the queue: ${video.url}\nPosition in queue: ${musicArray.length - 1}`);
				}
			}
		}

		playSong(song);

		player.on('error', error => {
			console.error(`Error: ${error.message}`);
		});

		player.on('stateChange', (oldState, newState) => {
			console.log(`Audio player transitioned from ${oldState.status} to ${newState.status}`);
		});

		// Play the next song in the queue after the original song finishes
		player.on(AudioPlayerStatus.Idle, () => {
			musicArray.shift();
			// If it's the last song in the queue, disconnect the bot
			if (connection && !musicArray.length) {
				connection.destroy();
			}

			// If there's another song in the queue, play the first one
			else if (musicArray.length) {
				createStream(musicArray[0]);
			}
		});

		// If a user disconnects/moves the bot, clear the queue
		// player.on(AudioPlayerStatus.AutoPaused, () => {
		// 	if (musicArray.length) {
		// 		musicArray.length = 0;
		// 	}
		// });
	},
};