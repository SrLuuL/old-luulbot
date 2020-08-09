module.exports.run = async (client, message, args, username, channel) => {

	
const fetch = require("node-fetch");
const res = await (await fetch("https://uncovered-treasure-v1.p.rapidapi.com/random", {headers:{
"x-rapidapi-host": "uncovered-treasure-v1.p.rapidapi.com",
	"x-rapidapi-key": "0c01d9eb32msh1fed7589a51207dp1e2df4jsne0a034176750",
	"useQueryString": true
}})).json
const translate = require("@vitalets/google-translate-api");

		
const {context, text} = res.results[0];
const translated = await translate(text, {to:"pt"});
	
client.say(channel, `${username}, (${context}) ${translated}`)

}


module.exports.config = {
	name: "amem",
	aliases: ["biblia","verso"],
	description: "Manda um verso aleatório da blíbia",
	usage: "amem"
}
