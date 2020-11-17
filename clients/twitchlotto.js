const { ChatClient } = require('dank-twitch-irc');

const client = new ChatClient({
	username: 'SrLuuL',
	password: process.env.TWITCHLT_AUTH
})

const channels = ['srluul', 'ghiletofar', 'cellbit', 'alanzoka', 'gabi', 'ljoga', 'mount', 'patopapao', 'felps', 'omeiaum'] 


client.connect()

client.joinAll(channels)


client.on('error', (error) => {
	console.warn(error)
})

client.on('ready', () => {
	console.log('TwitchLottoBot se conectou aos chats!')
})

module.exports = { client };
	