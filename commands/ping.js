module.exports.run = (client, message, args, username, channel) => {
	
	client.say(channel, "teste");
	
}

module.exports.config = {
	name: "ping",
	aliases: ["pong"],
	description: "Mostra o ping e outras informações do bot",
	usage: "ping"
}
	