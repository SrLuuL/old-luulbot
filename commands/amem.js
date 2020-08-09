module.exports.run = async (client, message, args, username, channel) => {

	
const fetch = require("node-fetch");
const translate = require("@vitalets/google-translate-api");

const res = await (await fetch("https://labs.bible.org/api/?passage=random&type=json")).json();
const {bookname, chapter, verse, text} = res[0];
const translated = await translate(text, {to:"pt"});

client.say(channel, `${username}, (${bookname} ${chapter}:${verse}) ${translated}`);
	
}


module.exports.config = {
	name: "amem",
	aliases: ["biblia","verso"],
	description: "Manda um verso aleatório da blíbia",
	usage: "amem"
}
