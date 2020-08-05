module.exports.run = async (client, message, args, username, channel) => {

const fetch = require("node-fetch");
const translate = require("@vitalets/google-translate-api");

const res = await (await fetch("http://www.boredapi.com/api/activity/")).json();
const {activity} = res;
const res2 = await translate(activity, {to:pt});

client.say(channel, `${username}, 🤔 ${res2.text}`)

}

module.exports.config = {
name: "tedio",
aliases: ["bored"],
description: "Manda uma atividade aleatória para te livrar do tédio",
usage: "tedio"
}
