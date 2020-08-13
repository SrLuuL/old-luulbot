module.exports.run = async (client, message, args, username, channel) => {

if (username !== "srluul") return;

const fetch = require("node-fetch");

const res = await (await fetch("http://jservice.io/api/random")).json();
const {answer, question} = res[0];

let trivaInfo = [];
let canal = channel.replace("#", "");

function triviaTime() {

triviaInfo.push({"channel": channel, "status": "ativo"});
client.say(channel, `${question}`);
triviaCheck()
}

function triviaCheck() {
setTimeout(async () => {
if (triviaInfo.find(i => i.channel == canal)) {
let triviaIndex = triviaInfo.find(i => i.channel == canal);
triviaInfo.splice(triviaIndex, 1);
client.say(channel, `:/ A resposta era: "${answer}"`);
}
}, 45000)
}

}

module.exports.config = {
name: "trivia",
aliases: ["trv"],
description: "Manda uma trivia(uso privado)",
usage: "trivia"
}
