module.exports.run = async ({args}) => {
  
  let sender = args.toLowerCase();
  
}

module.exports.config = {
 name: 'feriado',
 aliases: ['fd'],
 description: 'Mostra o feriado de hoje ou um específico.',
 usage: 'feriado [feriado/data]',
 cooldown: 5000,
 level: 'Todos'
}
