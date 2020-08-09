module.exports.run = async (client, message, args, username, channel) => {

	
const unirest = require("unirest")	
const res = await unirest("GET", "https://uncovered-treasure-v1.p.rapidapi.com/random");
const translate = require("@vitalets/google-translate-api");

		
res.headers({
	"x-rapidapi-host": "uncovered-treasure-v1.p.rapidapi.com",
	"x-rapidapi-key": "0c01d9eb32msh1fed7589a51207dp1e2df4jsne0a034176750",
	"useQueryString": true
});

const {context, text} = res.body.results[0];
const translated = await translate(text, {to:"pt"});
	
client.say(channel, `${username}, (${context}) ${translated}`)

}


module.exports.config = {
	name: "amem",
	aliases: ["biblia","verso"],
	description: "Manda um verso aleatório da blíbia",
	usage: "amem"
}
