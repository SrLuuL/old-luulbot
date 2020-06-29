const Discord = require("discord.js")
const luulbot = new Discord.Client();
const fs = require ("fs")

luulbot.commands = new Discord.Collection()
luulbot.aliases = new Discord.Collection()

let cmd = luulbot.commands;
let alias = luulbot.aliases;

fs.readdir("./commands", (err, files)  => { 
  if(err) console.log(err)

  let jsfile = files.filter(f => f.split('.').pop() === 'js')
  if(jsfile.length <= 0){
   
    return console.log(`[LOGS] Não  encontrei os comandos`);
  }
  jsfile.forEach((f, i)  =>{
    
    let pull = require(`../commands/${f}`)
    luulbot.commands.set(pull.config.name, pull)
    pull.config.aliases.forEach(alias  => {
      luulbot.aliases.set(alias, pull.config.name)
    })
  })
})


module.exports = { luulbot }