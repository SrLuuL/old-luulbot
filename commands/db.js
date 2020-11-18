module.exports.run = (client, message, args, username, channel) => {

const db = require('../clients/database.js').db



db.query(`${args.join(' ')}`, (err,result) => {
   if(err) return client.say(channel, `${username}, (${err.message}) ocorreu algum erro :/`);
  
    
    console.log(result.rows || result)
    client.say(channel, `${username}, olhe os logs para os resultados :) `)
  })
  
  }
  
  module.exports.config = {
  name: "db",
  aliases: [],
  description: "Database do bot",
  usage: "db",
  level: 'Dono',
  cooldown: 500
  }
