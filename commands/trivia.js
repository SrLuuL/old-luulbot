const trivia = {
running: false,
stopped: true
}


module.exports.run = async (client, message, args, username, channel) => {

const compare = require("compare-strings");
const db = require("../clients/database.js").db;
  
  
let num = 1



function delay(ms) {
return new Promise(res => setTimeout(res, ms))
}

 async function userInfo() {
   switch(args[0]) {
     case "points":
       if (!args[1]) {
         const userScore = await db.query(`SELECT score FROM luulbot_trivia WHERE userchannel = '${username}'`)
         if (userScore.rows[0] === undefined) {
           await client.say(channel, `${username}, você não acertou nenhuma trivia`)
         } else {
           await client.say(channel, `${username}, você acertou ${userScore.rows[0].score} trivias!`)
         }
       } else {
         const argsScore = await db.query(`SELECT score FROM luulbot_trivia WHERE userchannel = '${args[1]}'`)
         if (argsScore.rows[0] === undefined) {
           await client.say(channel, `${username}, este usuário ainda não acertou uma trivia`)
         } else {
           await client.say(channel, `${username}, este usuário já acertou ${argsScore.rows[0].score} trivias`)
         }
       }
       break;
     case "top":
       const leaderboard = await db.query(`SELECT * FROM luulbot_trivia ORDER BY score DESC LIMIT 5`);
       const leader = leaderboard.rows.map((i) => {
         return ` (${[i+1]}) ${i.userchannel}: ${i.score} `
       })
       await client.say(channel, `${leader}`)
       break;
   }
 }

    
userInfo()  
startTrivia()

async function startTrivia() {

if (!trivia.running && args[0] == "start") {

if(args[1]) {
if (/^-?\d+$/.test(args[1]) === false) { num = 1 };   
if (args[1] > 100 || args[1] < 1) { num = 100 }
else { num = args[1] }
}
  
trivia.running = true
trivia.stopped = false
let triviaId = 0  
let triviaChannel = channel  

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

async function triviaOn(channel, user, message, self) {
  
if (self) return;
if (channel !== triviaChannel) return;

const similarity = compare(message, answer[0])

if (similarity < 0.9) return 

clearTimeout(timer)

client.removeListener("chat", triviaOn)
 
const userScore = await db.query(`SELECT score FROM luulbot_trivia WHERE userchannel = '${user.username}'`)  
if (userScore.rows[0] === undefined) {
  await db.query(`INSERT INTO luulbot_trivia(userchannel, score) VALUES('${user.username}', 1)`)
} else {
  await db.query(`UPDATE luulbot_trivia SET score = score+1 WHERE userchannel = '${user.username}'`)
}
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
