module.exports.run = (client, message, args, username, channel) => {

const db = require('../clients/database.js').db

if (username !== "srluul") return;

db.query(`${args.join(' ')}`, (err,result) => {
   if(err){
      return obote.say(channel, `@${username}, (${err.message}) ocorreu algum erro :/`)
    }
    
   console.log(result.rows[0] || result)
    obote.say(channel, `${username}, olhe os logs para os resultados :) `)
  })
  
  }
  
  module.exports.config = {
  name: "db",
  aliases: ["database"],
  description: "Database do bot",
  usage: "db"
  }
