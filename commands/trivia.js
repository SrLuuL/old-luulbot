module.exports.run = async (client, message, args, username, channel) => {

const compare = require("compare-strings");


if (username !== "srluul") return;

let questions = [];
const trivia = {
running: false,
stopped: true
}

let num = 1

if (args[1] && !args[1].isNaN) {
if (args[1] > 100) return client.say(channel, `${username} número muito grande :/`)
else { num = args[1] }
}


  
 startTrivia() 
  
async function startTrivia() {

if (!trivia.running && args[0] === "start") {

trivia.running = true
trivia.stopped = false


try {

for(let i = 0; i < num; i++) {

if (!trivia.running || trivia.stopped === true) {
break
}

  
const quiz = require("../data/trivia.json");
const items = quiz[Math.floor(Math.random() * quiz.length)];
const {category, answer, question} = items; 
  
  
await client.say(channel, `Categoria: ${category} | ${question}`)

const done = new Promise(res => {

const timer = setTimeout(() => {
client.say(channel, `Ninguém acertou :/, a resposta era: ${answer[0]}`)
res()
}, 35000)


client.on("chat", (channel, user, message, self) => {

const similarity = compare(message, answer[0])

if (similarity < 0.9) return;

clearTimeout(timer)
res()
return client.say(channel, `${user.username} acertou! A resposta era: ${answer[0]}`)
})
})

await done
await delay(3000)
}

} finally {
client.say(channel, "Trivia acabou :Z")
trivia.running = false
}
 else if (args[0] === "stop") {
  trivia.stopped = true
}
}

  function delay(ms) {
    return new Promise(res => setTimeout(res, ms))
  }
  
  
  
}

module.exports.config = {
name: "trivia",
aliases: ["trv"],
description: "Manda uma trivia aleátoria",
usage: "trivia"
}

