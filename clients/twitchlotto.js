const { ChatClient } = require('dank-twitch-irc');

const client = new ChatClient({
	username: 'SrLuuL',
	password: process.env.TWITCHLT_AUTH
})

const channels = require('../data/channelslt.js');


client.connect()

client.joinAll(channels)


client.on('error', (error) => {
	if(error.failedChannelName) {
		console.log(`Não consegui conectar em  ${error.failedChannelName}`)
	}
})

client.on('ready', () => {
	console.log('TwitchLottoBot se conectou aos chats!')
})

module.exports = { client };
	
