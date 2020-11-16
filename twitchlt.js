const db = require('./clients/database.js').db;
const client = require('./clients/twitchlotto.js').client;


client.on('PRIVMSG', async (msg) => {
	
	const { messageText: message, displayName: username, channelID, senderUserID, channelName } = msg
	
	const imgRegex = /(http|https):\/\/(.*?)\.(imgur)\.(com)\/(.*?)\.(png|jpg|gif|PNG|JPG|GIF)/i
	const ytRegex = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?[\w\?‌​=]*)?/
	
	const imgValidation = imgRegex.exec(message);
	const ytValidation = ytRegex.exec(message);
	
	const linkDatabase = await db.query('SELECT * FROM luulbot_twitchlt');
	
	if (imgValidation) {
		
		if (linkDatabase.rows.find(i => i.url === imgValidation[0])) return;
		
		const currentDate = new Date().toLocaleString('pt-BR', {timeZone: 'America/Sao_Paulo'});
		
		await db.query('INSERT INTO luulbot_twitchlt (channel, channel_id, username, username_id, url, date) VALUES ($1,$2,$3,$4,$5,$6)', [channelName, channelID, username, senderUserID, imgValidation[0], new Date(currentDate)]);
	
	}
	
	if (ytValidation) {
		
		if (linkDatabase.rows.find(i => i.url === ytValidation[0])) return;
	
		const currentDate = new Date().toLocaleString('pt-BR', {timeZone: 'America/Sao_Paulo'});
		
		await db.query('INSERT INTO luulbot_twitchlt (channel, channel_id, username, username_id, url, date) VALUES ($1,$2,$3,$4,$5,$6)', [channelName, channelID, username, senderUserID, ytValidation[0], new Date(currentDate)]);
	
	}
})
