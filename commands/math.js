module.exports.run = async (client, message, args, username, channel) => {

const mathjs = require("mathjs")

if (!args[0]) {
return client.say(channel, `${username}, insira uma equação :/ `)
}

  try{
let math = await mathjs.evaluate(args.join(" "))
} catch (err) {
  return client.say(channel, `${username}, não consegui calcular isso :/`)
}
  
client.say(channel, `${username}, ${math}`)


}

module.exports.config = {
name: "math",
aliases: ["calc"],
description: "Calcula uma equação ou conversão",
usage: "math [equa]"
}
