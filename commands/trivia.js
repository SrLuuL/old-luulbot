const trivia = {
running: false,
stopped: true
}



module.exports.run = async (client, message, args, username, channel) => {

const compare = require("compare-strings");

  
  
let num = 1



function delay(ms) {
return new Promise(res => setTimeout(res, ms))
}

startTrivia()

async function startTrivia() {

if (!trivia.running && args[0] == "start") {

if(args[1] && typeof num === "number") {
if (args[1] > 100 || args[1] < 1) return client.say(channel, `${username} número muito grande/baixo :/`)
else {
  num = args[1]
}
}
  
trivia.running = true
trivia.stopped = false
let triviaId = 0  
  
try {

for(let i = 0; i < num; i++) {

if(!trivia.running || trivia.stopped) {
break
}

const quiz = require("../data/trivia.json");
const items = quiz[Math.floor(Math.random() * quiz.length)];

const {question, category, answer} = items;

await client.say(channel, ` ${triviaId += 1}/${num} | Categoria: ${category} | ${question} `)
  
const done = new Promise(res => {

const timer = setTimeout(() => {
client.removeListener("chat", triviaOn) 
client.say(channel, `Ninguém acertou :/ a resposta era: ${answer[0]}`)
res()
}, 35000)

function triviaOn(channel, user, message, self) {
  
   if (self) return;

const similarity = compare(message, answer[0])

if (similarity < 0.9) return 

clearTimeout(timer)

client.removeListener("chat", triviaOn)   
client.say(channel, `${user.username} acertou a pergunta! A resposta era: ${answer[0]}`)
res()
}  

client.addListener("chat", triviaOn) 
  
})

await done
await delay(7000)

}

} finally {
client.say(channel, "Trivia acabou :Z")
trivia.running = false
}

} else if(args[0] == "stop"){
trivia.stopped = true
}

}

}


module.exports.config = {
name: "trivia",
aliases: ["trv"],
description: "Manda uma trivia aleatória",
usage: "trivia start"
}
