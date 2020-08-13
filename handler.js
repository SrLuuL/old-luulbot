const client = require ("./clients/twitch.js").client
const luulbot = require ("./clients/discord.js").luulbot
const fetch = require("node-fetch");
const triviaInfo = [];


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


	
	
if(message.startsWith(prefix + "trivia")) {
   
   if (username !== "srluul") return;

  

	
const trivia = require("./data/trivia.json");
const randomTrivia = trivia[Math.floor(Math.random() * trivia.length)];	
const question = randomTrivia.question;
const answer = randomTrivia.answer;
const category = randomTrivia.category		

client.say(channel, `Categoria: ${category}, ${question}`);
triviaInfo.push({"userchannel": canal, "status": 'ativo', "question": question, "correct_answer": answer})
triviaCheck()


function triviaCheck() {
setTimeout(async () => {
let correct_answer = triviaInfo.find(i => i.userchannel === channel.replace('#', '')).answer	
if (triviaInfo.find(i => i.userchannel === canal)) {
let triviaIndex = triviaInfo.find(i => i.userchannel === canal);
triviaInfo.splice(triviaIndex, 1);
client.say(channel, `:/ A resposta era: ${answer}`);
}
}, 35000)
}
	
}
	

if(triviaInfo.find(i => i.userchannel === channel.replace('#', ''))){
	 if(answer.includes(message.toLowerCase())){
		 let triviaIndex = triviaInfo.findIndex(x => x.userchannel === channel.replace('#', ''));
		 client.Trivia.splice(triviaIndex, 1)
		 client.say(channel, `${username} acertou a pergunta :O`)
	 }
   }	

	
setTimeout(() => {
	globalCD.delete(username)
}, 5000);

});
