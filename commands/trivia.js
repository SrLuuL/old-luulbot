module.exports.run = async (client, message, args, username, channel) => {

const questions = [];
const trivia = {
running: false
}

startTrivia()

function startTrivia() {

const quiz = require("../data/trivia.js");
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
}
}, 35000)
}

}

module.exports.config = {
name: "trivia",
aliases: ["trv"],
description: "Manda uma trivia aleatória",
usage: "trivia"
}
