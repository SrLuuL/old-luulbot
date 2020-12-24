module.exports.run = async () => {

   try {
const fetch = require("node-fetch");
const translateapi = require("@kaysilvn/google-translate-api");
const translate = new translateapi().translate;

const res = await (await fetch("http://www.boredapi.com/api/activity/")).json();
const {activity} = res;
const res2 = await translate(activity, { src_lang: 'auto', tar_lang:'pt'});

const emojiList = ['🤔', '😀', '⭐️', '🕒', '🔮', '⌛️', '💡', '🔍', '💭', '✨'];
const randomEmoji = emojiList[Math.floor(Math.random() * emojiList.length)];

if(res2 === 'Cor') {
 return { reply: `${randomEmoji} Colorir` }  
}
      
      
return {
 reply: `${randomEmoji} ${res2}` 
}

   } catch(e) {
    return { reply: `sem atividades no momento O_o `} 
   }
     
}

module.exports.config = {
name: "tedio",
aliases: ["bored"],
description: "Manda uma atividade aleatória para te livrar do tédio",
usage: "tedio",
level: 'Todos',
cooldown: 7000    
}
