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

const res = await (await fetch("http://jservice.io/api/random")).json();
const {answer, question} = res[0];
let triviaInfo = [];	
	
if(message.startsWith(prefix + "trivia")) {
   
   if (username !== "srluul") return;


triviaTime();  
  
function triviaTime() {
triviaInfo.push({"channel": canal, "status": "ativo", "answer": answer});
client.say(channel, `${question}`);
triviaCheck()
}

function triviaCheck() {
setTimeout(async () => {
if (triviaInfo.find(i => i.channel === canal)) {
let triviaIndex = triviaInfo.find(i => i.channel === canal);
triviaInfo.splice(triviaIndex, 1);
client.say(channel, `:/ A resposta era: ${answer}`);
}
}, 35000)
}
	
}
	
	
if (triviaInfo.find(i => i.channel === canal)) {
	let triviaAnswer = triviaInfo.find(i => i.channel === canal).answer
	if (message.toLowerCase().includes(triviaAnswer)) {
		let triviaIndex = triviaInfo.find(i => channel === canal);
		triviaInfo.splice(triviaIndex, 1);
		client.say(channel, `${username} acertou a pergunta :O`);
	}
}
	
setTimeout(() => {
	globalCD.delete(username)
}, 5000);

});
