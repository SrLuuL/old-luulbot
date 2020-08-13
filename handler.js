const client = require ("./clients/twitch.js").client
const luulbot = require ("./clients/discord.js").luulbot
const fetch = require("node-fetch");
client.Trivia = [];


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


if(client.Trivia.find(i => i.channel === channel.replace('#', ''))){
	 let correct_answer = client.Trivia.find(i => i.channel === channel.replace('#', '')).answer
	 if(correct_answer.includes(message.toLowerCase())){
		 let triviaIndex = client.Trivia.findIndex(x => x.channel === channel.replace('#', ''));
		 client.Trivia.splice(triviaIndex, 1)
		 client.say(channel, `${username} acertou a pergunta :O`)
	 }
   }
	
	
if(message.startsWith(prefix + "trivia")) {
   
   if (username !== "srluul") return;

  
	
	
triviaTime();  
  
function triviaTime() {
	
const trivia = require("./data/trivia.json");
const randomTrivia = trivia[Math.floor(Math.random() * trivia.length)];	
const question = randomTrivia.question;
const answer = randomTrivia.answer;
const category = randomTrivia.category		

client.say(channel, `Categoria: ${category}, ${question}`);
client.Trivia.push({"channel": canal, "answer": answer});
triviaCheck()
}

function triviaCheck() {
setTimeout(async () => {
if (client.Trivia.find(i => i.channel === canal)) {
let triviaIndex = client.Trivia.find(i => i.channel === canal);
client.Trivia.splice(triviaIndex, 1);
client.say(channel, `:/ A resposta era: ${client.Trivia.find(i => i.channel).answer}`);
}
}, 35000)
}
	
}
	
	

	
setTimeout(() => {
	globalCD.delete(username)
}, 5000);

});
