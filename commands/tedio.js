module.exports.run = async (client, message, args, username, channel) => {

const fetch = require("node-fetch");
const translateapi = require("@kaysilvn/google-translate-api");
const translate = new translateapi().translate;

const res = await (await fetch("http://www.boredapi.com/api/activity/")).json();
const {activity} = res;
const res2 = await translate(activity, { src_lang: 'auto', tar_lang:'pt'});

const randomEmoji = await (await fetch("https://ranmoji.herokuapp.com/emojis/api/v.1.0/")).json();
const emoji = randomEmoji.emoji.slice(3);
  
client.say(channel, `${username}, \u{emoji} ${res2}`)

}

module.exports.config = {
name: "tedio",
aliases: ["bored"],
description: "Manda uma atividade aleatória para te livrar do tédio",
usage: "tedio"
}
