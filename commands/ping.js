

module.exports.run =  async (client, message, args, username, channel) => {

	const db = require('../clients/database.js').db;
        const si = require("systeminformation");
	const ms = require('pretty-ms');
        let total = process.memoryUsage().heapTotal / 1024 / 1024;
	let realtotal = Math.round(total * 100) / 100;
	const ping = await client.ping() * 1000;
	const date = await db.query(`SELECT * FROM luulbot_info WHERE setting = 'uptime'`)
	const uptime = await ms(Date.now() - date.rows[0].value, {secondsDecimalDigits: 0});

	
	
client.say(channel, `Pong! Ping: ${ping} ms | Memória: ${realtotal} MB | Uptime: ${uptime}`)
	
}

module.exports.config = {
	name: "ping",
	aliases: ["pong", "uptime"],
	description: "Verificar se o bot está acordado",
	usage: "ping"
}
	
