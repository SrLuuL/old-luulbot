const trivia = {
running: false,
stopped: true
}

const compare = require("compare-strings");

module.exports.run = async (client, message, args, username, channel) => {

let num = 1

if(args[1] && !args[1].isNaN) {
num = (args[1] > 100) ? return client.say(channel, `${username} número muito alto :/`) : num = args[1];
}

function delay(ms) {
return new Promise(res => setTimeout(res, ms))
}

startTrivia()

function startTrivia() {

if (!trivia.running && args[0] == "start") {


try {

for(let i = 0; i < num; i++) {

if(!trivia.running || trivia.stopped) {
break
}

const quiz = require("../data/trivia.json");
const items = quiz[Math.floor(Math.random() * quiz.length)];

const {questions, category, answer} = items;

await client.say(channel, `Categoria: ${category} | ${question}`)

const done = new Promise(res => {

const timer = setTimeout(() => {
client.say(channel, `Ninguém acertou :/ a resposta era: ${answer[0]}`)
res()
}, 35000)

client.once("chat", (channel, message, user, self) => {

if (self) return;

const similarity = compare(message, answer[0])

if (similarity < 0.9) return;

clearTimeout(timer)

client.say(channel, `${username} acertou a pergunta! A resposta era: ${answer[0]}
res()
})
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
