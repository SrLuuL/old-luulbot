const client = require ("./clients/twitch.js").client
const luulbot = require ("./clients/discord.js").luulbot
const fetch = require("node-fetch");

const questions = [];
const trivia = {
running: false
}

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
	
	
	if (questions.find(i => i.channel === channel)) {
		let answer = questions.find(i => i.channel === channel).answer;
		if (answer.includes(message.toLowerCase())) {
		    client.say(channel, `${username} acertou a pergunta!`)
		    let triviaIndex = questions.findIndex(i => i.channel === channel);
		    questions.splice(triviaIndex, 1)
		}
	}
	
	
	if (!message.startsWith(prefix)) return;

globalCD.add(username);

let cmdfile = luulbot.commands.get(command) || luulbot.commands.get(luulbot.aliases.get(command))

if (cmdfile) cmdfile.run(client, message, args, username, channel, cmd, alias);

	
setTimeout(() => {
	globalCD.delete(username)
}, 5000);

	
	
if (message.startsWith(prefix + "trivia")) {	
	


startTrivia()

function startTrivia() {

const quiz = require("./data/trivia.js");
const item = quiz[Math.floor(Math.random() * quiz.length)];

const question = item.question;
const answer = item.answer;
const category = item.category;

client.say(channel, `Categoria: ${category} | ${question}`);
questions.push({channel: channel, question: question, answer: answer, category: category});
checkTrivia()
}

function checkTrivia() {
if (questions.find(i => i.channel === channel)) {
setTimeout(async () => {
const answer = questions.find(i => i.channel === channel).answer
client.say(channel, `Ninguém acertou a trivia :/ A resposta era: ${answer}`)
let triviaIndex = questions.findIndex(i => i.channel === channel);
questions.splice(triviaIndex, 1)
}, 35000)
}  
}  

}	
	
});



