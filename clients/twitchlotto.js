const DankTwitch = require('dank-twitch-irc');

const client = new DankTwitch({
	username: 'SrLuuL',
	password: process.env.TWITCHLT_AUTH
})

const channels = require('../data/channelslt.js');


client.connect()

client.joinAll(channels)


client.on('error', (error) => {
	if(error instanceof DankTwitch.JoinError && error.failedChannelName) {
		console.log(`${this.failedJoinChannels} não foram carregados`)
	}
})

client.on('ready', () => {
	console.log('TwitchLottoBot se conectou aos chats!')
})

module.exports = { client };
	
