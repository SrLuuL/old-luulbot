const client = require ("./clients/twitch.js").client
const luulbot = require ("./clients/discord.js").luulbot
const fetch = require("node-fetch");


let prefix = "=";
let globalCD = new Set();
let cmd = luulbot.commands;
let alias = luulbot.aliases;





client.on("message", async (channel, user, message, self) => {
	
	let username = user.username
	let args = message.slice(prefix.length).trim().split(/ +/g);
	let command = args.shift().toLowerCase();
	let canal = channel.replace("#", "");

	if (self) return;
	
	if (globalCD.has(username)) return;
	
	if (!message.startsWith(prefix)) return;

globalCD.add(username);

let cmdfile = luulbot.commands.get(command) || luulbot.commands.get(luulbot.aliases.get(command))

if (cmdfile) cmdfile.run(client, message, args, username, channel, cmd, alias);


const trivia = {
	running: false
}

let questions = [];
	
	
	if (trivia.running === true) {
	setTimeout(() => console.log("a"), 1000)
}
	
	
if (message.startsWith(prefix + "trivia")) {
    
    if (username !== "srluul") return;

	
trivia.running = true
	
	
startTrivia()
	
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
	let answer = questions.find(i => i.channel).answer
	client.say(channel, `:/ A resposta era: ${answer}`)
	trivia.running = false
	questions = [];
}
	}, 35000)
}
	
	
}	
	
	
setTimeout(() => {
	globalCD.delete(username)
}, 5000);

});



