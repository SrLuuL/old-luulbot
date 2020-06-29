module.exports.run = (client, message, args, username, channel) => {

var req = unirest("GET", "https://uncovered-treasure-v1.p.rapidapi.com/random");


		
req.headers({
	"x-rapidapi-host": "uncovered-treasure-v1.p.rapidapi.com",
	"x-rapidapi-key": "0c01d9eb32msh1fed7589a51207dp1e2df4jsne0a034176750",
	"useQueryString": true
});


req.end(function (res) {

	
	let context = res.body.results[0].context
	let verse = res.body.results[0].text
	
	 const translate = require("@vitalets/google-translate-api");

    translate(verse, { to: "pt" })
      .then(res => {
        let texto = res.text;
	
	client.say(channel, `${username}, ${context}: ${texto}`)
})

})

}


module.exports.config = {
	name: "amem",
	aliases: ["biblia","verso"],
	description: "Manda um verso aleatório da blíbia",
	usage: "amem"
}
