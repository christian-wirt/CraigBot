const { createAudioPlayer, createAudioResource, joinVoiceChannel, AudioPlayerStatus } = require('@discordjs/voice');
const { Interaction } = require('discord.js');
const ytdl = require('ytdl-core');
const playMusic = require('../commands/playMusic.js');
// const { start } = require('repl');

module.exports = {
	name: 'voiceStateUpdate',
	execute(oldState, newState) {

		// Get music array
		const musicArray = playMusic.getQueue();

		// Create audio player
		const player = createAudioPlayer();
		let resource = '';

		const username = oldState.member.user.username;
		// const userId = oldState.member.user.userid;
		const createStream = (str) => {
			try {
				musicArray.push(str);
				if (musicArray.length === 1) {
					if (ytdl.validateURL(str)) {
						resource = createAudioResource(ytdl(str, {
							filter: 'audioonly',
							fmt: 'mp3',
							opusEncoded: false,
							encoderArgs: ['-af', 'bass=g=10,dynaudnorm=f=200'],
							highWaterMark: 1 << 25,
						}));
	
						// Set up voice channel connection
						const connection = joinVoiceChannel({
							channelId: newState.channel.id,
							guildId: newState.channel.guild.id,
							adapterCreator: newState.channel.guild.voiceAdapterCreator,
						});
	
						// Join channel and play voice
						connection.subscribe(player);
						player.play(resource);
	
						// Remove after 15 seconds
						setTimeout(() => player.stop(), 15000);
	
						player.on('error', error => {
							console.error(`Error: ${error.message}`);
						});
	
						player.on(AudioPlayerStatus.Idle, () => {
							connection.destroy();
							musicArray.length = 0;
						});
					}
					else {
						console.log('Invalid URL!');
					}
				}
				else {
					console.log('Theme song added to end of queue.');
				}

			}
			catch (err) {
				console.error(err);
			}
		};

		const playIntro = (user) => {
			if (user === 'keyboard') { createStream('https://www.youtube.com/watch?v=zzICMIu5zFY'); }
			else if (user === 'DeafeningElk13') { createStream('https://www.youtube.com/watch?v=YCVXe5ZmZrs'); }
			else if (user === 'TheNumbers') { createStream('https://www.youtube.com/watch?v=ZjhkSjb41VQ'); }
			else if (user === 'Phantaam') { createStream('https://www.youtube.com/watch?v=ReEgXh-wURs'); }
			else if (user === 'Ligma_Sox') { createStream('https://www.youtube.com/watch?v=skFWsc_-i14'); }
			else if (user === 'awesomeeric97') { createStream('https://www.youtube.com/watch?v=3UnK5rw_6hM'); }
			else if (user === 'Bartacus') { createStream('https://www.youtube.com/watch?v=Dy4HA3vUv2c'); }
			else if (user === 'Buukes') { createStream('https://www.youtube.com/watch?v=UtVJdPfm0F8'); }
			else if (user === 'im eight') { createStream('https://www.youtube.com/watch?v=QQcQDbpDH_o'); }
			else if (user === 'jedster99') { createStream('https://www.youtube.com/watch?v=wN8IT-Bn7MQ'); }
			else if (user === 'Larry Lovestein') { createStream('https://www.youtube.com/watch?v=KQ6GOvp15Tk'); }
		};

		if (player.state.status !== 'Playing') {

			// User is switching between channels
			if (newState.channel && oldState.channel && newState.channel.id === '321789978113867777') {
				if (newState.channel.id !== oldState.channel.id) {
					console.log(`${username} joined ${newState.channel.name}.`);
					playIntro(username);
				}
			}
			// User is connecting
			else if (newState.channel && newState.channel.id === '321789978113867777') {

				console.log(`${username} joined ${newState.channel.name}.`);
				playIntro(username);
			}
		}

		player.on(AudioPlayerStatus.AutoPaused, () => {
			console.log('Test');
			musicArray.length = 0;
		});
	},
};