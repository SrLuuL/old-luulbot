const client = require ("./clients/twitch.js").client
const luulbot = require ("./clients/discord.js").luulbot
const fetch = require("node-fetch");
const trivia = [];0
const compareStrings = require("compare-strings");

let prefix = "=";
let globalCD = new Set();
let cmd = luulbot.commands;
let alias = luulbot.aliases;



client.on("message", async (channel, user, message, self) => {
	
	let username = user.username
	let args = message.slice(prefix.length).trim().split(/ +/g);
	let command = args.shift().toLowerCase();
	let canal = channel.replace("#", "");
	
	if (trivia.find(i => i.channel === channel)) {
		let answer = trivia.find(i => i.channel === channel).answer;
		const similarity = compareStrings(message, answer)
		if (similarity > 0.9) {
			client.say(channel, `${username} acertou a pergunta! (${answer})`)
			let triviaIndex = trivia.findIndex(i => i.channel === channel);
			trivia.splice(triviaIndex, 1);
		}

	}
	

	if (self) return;
	
	if (globalCD.has(username)) return;

	if (!message.startsWith(prefix)) return;

globalCD.add(username);

let cmdfile = luulbot.commands.get(command) || luulbot.commands.get(luulbot.aliases.get(command))

if (cmdfile) cmdfile.run(client, message, args, username, channel, cmd, alias);

	
setTimeout(() => {
	globalCD.delete(username)
}, 5000);

	
if (message.startsWith(prefix + "trivia")) {
	
	if (username !== "srluul") return;
	if (trivia.find(i => i.running)) return;
	
	startTrivia()
	
	function startTrivia() {

		const quiz = require("./data/trivia.json")
		const items = quiz[Math.floor(Math.random() * quiz.length)];
		
		const question = items.question
		const category = items.category
		const answer = items.answer
		
		client.say(channel, `Categoria: ${category} | ${question}`)
		trivia.push({ channel: channel, running: true, answer: answer });
		checkTrivia()
	}
	
	function checkTrivia() {
		setTimeout(async() => {
			if (trivia.find(i => i.channel === channel)) {
				let answer = trivia.find(i => i.channel === channel).answer[0];
				client.say(channel, `Ninguém acertou :/, a resposta era: ${answer}`)
				let triviaIndex = trivia.findIndex(i => i.channel === channel);
				trivia.splice(triviaIndex, 1)
			}
		}, 35000)
	}
	
}
	
});



