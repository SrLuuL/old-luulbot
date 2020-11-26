module.exports.run = async (context) => {

const db = require('../clients/database.js').db

const dbQuery = await  db.query(`${context.args.join(' ')}`, (err,result) => {
   if(err) return { reply: `(${err.message}) ocorreu algum erro :/` }
    
    console.log(result.rows || result)
    return { reply: 'olhe os logs :)' }
  });

return dbQuery
  
  }
  
  module.exports.config = {
  name: "db",
  aliases: [],
  description: "Database do bot",
  usage: "db",
  level: 'Dono',
  cooldown: 500
  }
