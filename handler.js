const client = require ("./clients/twitch.js").client
const luulbot = require ("./clients/discord.js").luulbot
const fetch = require("node-fetch");


let prefix = "=";
let globalCD = new Set();
let cmd = luulbot.commands;
let alias = luulbot.aliases;

const trivia = {
	running: false
}

let questions = [];

client.on("message", async (channel, user, message, self) => {
	
	let username = user.username
	
	if (trivia.running === true) {
	let answer = questions.find(i => i.channel).answer
	if (answer.includes(message.toLowerCase())) {
    client.say(channel, `${username}, acertou a pergunta :O`)
    trivia.running = false
    let triviaIndex = questions.find(i => i.channel === channel)
    questions.splice(triviaIndex, 1)
}
	}
	
	
	let args = message.slice(prefix.length).trim().split(/ +/g);
	let command = args.shift().toLowerCase();
	let canal = channel.replace("#", "");

	if (self) return;
	
	if (globalCD.has(username)) return;
	
	if (!message.startsWith(prefix)) return;

globalCD.add(username);

let cmdfile = luulbot.commands.get(command) || luulbot.commands.get(luulbot.aliases.get(command))

if (cmdfile) cmdfile.run(client, message, args, username, channel, cmd, alias);




function delay(ms) {
  return new Promise(res => setTimeout(res, ms))
}
	
	
	
if (message.startsWith(prefix + "trivia")) {
    
if (username !== "srluul") return;
if (trivia.running === true) return

	
trivia.running = true
	
	
	if (args[0]) {
		for(let x = 0; x < args[0]; x++) {
			startTrivia()
			await delay(5000)
		}
	}
	else {
startTrivia()
	}
		
function startTrivia() {
	
	const quiz = require("./data/trivia.json")
	const items = quiz[Math.floor(Math.random() * quiz.length)];
	
	const question = items.question
	const answer = items.answer
	const category = items.category
	
	questions.push({
		category: category,
		answer: answer,
		question: question,
		channel: channel
})	

	
	
	client.say(channel, `Categoria: ${category} | ${question}`)
	checkTrivia()
	
}
	

	
function checkTrivia() {
	setTimeout(async () => {
if (trivia.running) {
	let answer = questions.find(i => i.channel).answer[0]
	client.say(channel, `:/ A resposta era: ${answer}`)
	trivia.running = false
	let triviaIndex = questions.find(i => i.channel === channel)
	questions.splice(triviaIndex, 1)
}
	}, 35000)
}
	
	
}	
	
	
setTimeout(() => {
	globalCD.delete(username)
}, 5000);

});



