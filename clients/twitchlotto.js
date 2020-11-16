const { ChatClient } = require('dank-twitch-irc');

const client = new ChatClient({
	username: 'SrLuuL',
	password: 'oauth:7e46sisoj4putjykwkm2m2r2qt16cq'
})

const channels = ['srluul', 'ghiletofar', 'cellbit', 'alanzoka', 'smurfdomuca', 'gabi', 'ljoga', 'mount', 'patopapao', 'felps', 'omeiaum'] 


client.connect()

client.joinAll(channels)


client.on('error', (error) => {
	console.warn(error)
})

client.on('ready', () => {
	console.log('TwitchLottoBot se conectou aos chats!')
})

module.exports = { client };
	
