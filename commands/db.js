module.exports.run = (args) => {

const db = require('../clients/database.js').db



db.query(`${args.join(' ')}`, (err,result) => {
   if(err) return { reply: `(${err.message}) ocorreu algum erro :/` }
    
    console.log(result.rows || result)
    return { reply: 'olhe os logs :)' }
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
