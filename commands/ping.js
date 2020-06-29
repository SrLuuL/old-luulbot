const si = require("systeminformation");

module.exports.run = (client, message, args, username, channel) => {



    let total = process.memoryUsage().heapTotal / 1024 / 1024;
    let realtotal = Math.round(total * 100) / 100;

    client.ping().then(data => {
      let ping = Math.floor(Math.round(data * 1000));

      client.say(channel, `Ping: ${ping} ms || luul.glitch.me/ || Memoria: ${realtotal}MB/512MB `);
    });
	
}

module.exports.config = {
	name: "ping",
	aliases: ["pong"],
	description: "Mostra o ping e outras informações do bot",
	usage: "ping"
}
	
