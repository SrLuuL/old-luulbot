const trivia = []

module.exports.run = async (context) => {

  const {user, args, client, channel} = context;
  let triviaLength = args[1] || 1;
  const questions = require('../data/trivia.json');
  const db = require('../clients/database.js').db;
  const compare = require('compare-strings');
  const channelDB = await db.query(`SELECT  * FROM luulbot_channels WHERE userchannel = '${channel.replace(/#/, '')}'`); 
  
const sleep = (ms) => {
  return new Promise(res => setTimeout(res, ms));
}
  
if(!args[0]) {
  return { reply: 'Comece ou termine uma trivia com: trivia [start/stop]' }
}
  
  function fetchQuestions(num) {
    let questionList = [];
    for(let i = 0; i < num; i++) {
      let randomQuestion = questions[Math.floor(Math.random() * questions.length)]
      let {answer, category, question}  = randomQuestion;
      questionList.push({category: category, question: question, answer: answer})
    }
    return questionList
  }

  
  
async function triviaStart(questionList) {
  
  
  if(args[0] === 'start' && trivia.find(i => i.channel === channel)) {
  return `Uma trivia já está rolando neste canal!`
  }
  
  if (args[0] === 'start' && !trivia.find(i => i.channel === channel)) {

    trivia.push({channel: channel, running: true, stopped: false}) 
    
    if (isNaN(triviaLength)) {
  return 'Número de trivias inválido :/'
} else {
  if(triviaLength < 1 || triviaLength > 100) {
    return 'Máximo: 100 | Mínimo: 1'
  }
}
    
    
    try {
      
      for(const ind in questionList) {
        let item = questionList[ind]
        let questionNum = parseInt(ind);
        
        if(!trivia.find(i => i.channel === channel)) {
          break
        }
        
        if(channelDB.rows[0].status === 'online' && channelDB.rows[0].stream_mode) {
          break
        }
        
        
        await client.say(channel, `[${questionNum+1}/${triviaLength}] | ${item.question} | Categoria: ${item.category}`)
        
        const done = new Promise(res => {
          
          const timer = setTimeout(() => {
           client.removeListener('message', triviaVerifier); 
           client.say(channel, `Ninguém acertou :/ | Resposta: ${item.answer[0]}`);
           res()
          }, 20000)
          
          
          async function triviaVerifier(channel, user, message){
            
            if(!trivia.map(i => i.channel).includes(channel)) return;
            const similar = compare(message, item.answer[0]);
            if (similar < 0.9) return;
            
            clearTimeout(timer)
            
            client.removeListener('message', triviaVerifier);
            client.say(channel, `${user.username} acertou! | Resposta: ${item.answer[0]}`);
            
            const triviaDB = await db.query(`SELECT * FROM luulbot_trivia WHERE user_name = '${user.username}'`);
            
            if (!triviaDB.rowCount) {
            await db.query(`INSERT INTO luulbot_trivia(user_name, user_id, user_points) VALUES($1, $2, $3)`, [user.username, user['user-id'], 1])
            } else {
            await db.query(`UPDATE luulbot_trivia SET user_points = user_points+1 WHERE user_name = '${user.username}'`)
            }
            res() 
            
          }
          
            client.addListener('message', triviaVerifier)
          
        })
        
        await done;
        await sleep(7000)
        
      }
        
      } finally {
        client.say(channel, 'Trivia acabou :Z');
        let channelIndex = trivia.findIndex(i => i.channel);
        trivia.splice(channelIndex, 1)
      }
      
      } else if(args[0] === 'stop') {
        let channelIndex = trivia.findIndex(i => i.channel);
        trivia.splice(channelIndex, 1)
      } 
}

  
  return { 
    mode: 'event',
    reply: await triviaStart(fetchQuestions(triviaLength)) 
  }
  
}

module.exports.config = {
name: 'trivia',
aliases: [],
usage: 'trivia [start/stop]',
description: 'Começa/termina uma trivia com perguntas de diferentes categorias(solicite permissão caso queira o comando).',
level: 'Privado',
cooldown: 6000    
}
