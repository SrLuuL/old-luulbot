
module.exports.run = ({args}) => {
  
  if(!args[0]) {
   return { reply: `você botou si mesmo para dormir :/` } 
  }
  
  let emote = (!args[1]) ? ':)' : args[1];
  
  return {
   reply: `você botou ${args[0]} para dormir ${emote} 👉 🛏️` 
  }
  
}


module.exports.config = {
 name: 'tuck',
 aliases: [''],
 description: 'Bote alguém para dormir',
 usage: 'tuck [user]',
 cooldown: 3000,
 level: 'Todos'
}
