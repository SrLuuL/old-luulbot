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


	
const triviaInfo = [];		
	
if(message.startsWith(prefix + "trivia")) {
   
   if (username !== "srluul") return;


triviaTime()
	
function triviaTime() {

const quiz = require('./data/trivia.json');
const item = quiz[Math.floor(Math.random() * quiz.length)];
let question = item.question
let correct_answer = item.answer
let category = item.category	
	
client.say(channel, `Categoria: ${category}, ${question}`);
triviaInfo.push({"userchannel": channel, "question": question, "correct_answer": correct_answer})
triviaCheck()
}
	
	
function triviaCheck() {
setTimeout(() => {
let answer = triviaInfo.find(i => i.userchannel === channel).correct_answer
if (triviaInfo.find(i => i.userchannel === channel)) {
let triviaIndex = triviaInfo.find(i => i.userchannel === channel);
triviaInfo.splice(triviaIndex, 1);
client.say(channel, `:/ A resposta era: ${answer}`);
}
}, 35000)
}
	

}	
	
if(triviaInfo.find(i => i.userchannel === channel)){
	 let answer = triviaInfo.find(i => i.userchannel === channel).correct_answer
	 if(message.toLowerCase().includes(answer)){
		 let triviaIndex = triviaInfo.findIndex(x => x.userchannel === channel);
		 client.Trivia.splice(triviaIndex, 1)
		 client.say(channel, `${username} acertou a pergunta :O`)
	 }
   }	

	
setTimeout(() => {
	globalCD.delete(username)
}, 5000);

});
