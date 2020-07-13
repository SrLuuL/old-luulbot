module.exports.run = async (client, message, args, username, channel) => {

  try {
  
let content = args.join(" ")

const evaluated = eval(content)

if (username !== "srluul") return client.say(channel, `${username}, você não tem permissão para isso :/`);

if (!args[0]) return client.say(channel, `${username}, insira um código :/`)
else return client.say(channel, `${username}, resultado: ${evaluated}`)

  } catch (err) {
    return client.say(channel, `${username}, ocorreu algum erro :/`)
  }
    
}

module.exports.config = {
name: "eval",
aliases: ["dankeval"],
description: "Executa um código do bot",
usage: "eval [conteúdo]"
}
