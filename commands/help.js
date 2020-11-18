module.exports.run = (client, message, args, username, channel, cmd, alias) => {

 
if (!args[0]) {

client.say(channel, `${username}, comandos em: https://luulbot.herokuapp.com/comandos`)
 
} 
 else {
let command = cmd.get(alias.get(args[0].toLowerCase()) || args[0].toLowerCase());
if (!command) return client.say(channel, `${username}, comando inexistente  :/ `)
command = command.config
client.say(channel, `${username}, =${command.name}[${command.aliases}]: ${command.description}(${(command.cooldown/1000)} s cooldown)`)

}
  
}
  
module.exports.config = {
name: "help",
aliases: ["ajuda", "comandos"],
description: "Mostra as informações sobre os comandos",
usage: "help [comando]",
level: 'Todos',
cooldown: 4000
}
