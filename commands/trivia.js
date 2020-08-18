module.exports.run = async (client, message, args, username, channel) => {

const compare = require("compare-strings");


if (username !== "srluul") return;

const questions = [];
const trivia = {
running: false,
stopped: true
}

const num = 1

if (!args[0].isNaN) {
if (args[0] > 100) return client.say(channel, `${username} número muito grande :/`)
else { num = args[0] }
}

if (args[0] == "stop") {
trivia.stopped = true
}

function startTrivia() {

if (trivia.running) return;

trivia.running = true
trivia.stopped = false

const quiz = require("../data/trivia.json");
const items = quiz[Math.floor(Math.random() * quiz.length)];

const {category, answer, question} = items;

try {

for(let i = 0; i < num; i++) {

if (!trivia.running || trivia.stopped) {
break
}

await client.say(channel, `Categoria: ${category} | ${answer[0]}`)

const done = new Promise(res => {

const timer = setTimeout(() => {
client.say(channel, `Ninguém acertou :/, a resposta era: ${answer[0]}`)
res()
}, 35000)


client.on("chat", (channel, user, message, self) => {

const similarity = compare(message, answer[0])

if (similarity < 0.9) return;

clearTimeout(timer)
client.say(channel, `${username} acertou! A resposta era: ${answer[0]}`)
res()
})
})

await done
await delay(2000)
}

} finally {
client.say(channel, "Trivia acabou :Z")
trivia.running = false
}
}

}

module.exports.config = {
name: "trivia",
aliases: ["trv"],
description: "Manda uma trivia aleátoria",
usage: "trivia"
}

