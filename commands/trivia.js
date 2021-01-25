const trivia = {
  running: false,
  stopped: true,
}

module.exports = { trivia }

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
  
  

async function triviaStart() {
  
  if(args[0] === 'start' && trivia.running && trivia.channel !== channel) {
  return `Uma trivia já está rolando em: ${trivia.channel}!`
  }
  
  if (args[0] === 'start' && !trivia.running) {
    
    trivia.running = true;
    trivia.stopped = false;
    trivia.channel = channel;
    
    if (isNaN(triviaLength)) {
  return 'Número de trivias inválido :/'
} else {
  if(triviaLength < 1 || triviaLength > 100) {
    return 'Máximo: 100 | Mínimo: 1'
  }
}
    
    
    try {
      
      for(let i = 0; i < triviaLength; i++) {
        
        if(!trivia.running || trivia.stopped) {
          break
        }
        
        if(channelDB.rows[0].status === 'online' && channelDB.rows[0].stream_mode) {
          break
        }
        
        const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
        const {category, question, answer} = randomQuestion;
        
        await client.say(channel, `[${i+1}/${triviaLength}] | ${question} | Categoria: ${category}`)
        
        const done = new Promise(res => {
          
          const timer = setTimeout(() => {
           client.removeListener('message', triviaVerifier); 
           client.say(channel, `Ninguém acertou :/ | Resposta: ${answer}`);
           res()
          }, 20000)
          
          
          async function triviaVerifier(channel, user, message){
            
            if(trivia.channel !== channel) return;
            const similar = compare(message, answer[0]);
            if (similar < 0.9) return;
            
            clearTimeout(timer)
            
            client.removeListener('message', triviaVerifier);
            client.say(channel, `${user.username} acertou! | Resposta: ${answer}`);
            
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
        trivia.running = false
      }
      
      } else if(args[0] === 'stop') {
        trivia.stopped = true
        trivia.channel = false
      } 
}

  return { 
    mode: 'event',
    reply: await triviaStart() 
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
