module.exports.run = async ({args}) => {
  
  let feriados = require('../data/feriados.json');
  const moment = require('moment-timezone');
  const ms = require('pretty-ms');
  
  const currentDate = moment().tz('America/Bahia').valueOf();
  
  
  
  if(!args[0]) {
    
    let todayMonth = new Date().getMonth() + 1;
    let todayDay = new Date().getDate();
   
    
    let todayDate = `${todayDay.toString().padStart(2, "0")}/${todayMonth.toString().padStart(2, "0")}`
    
    let todayHolidayLength = feriados.filter(i => i.dateS === todayDate);
    
    if(!todayHolidayLength) {
     return { reply: `hoje é ${todayDate}, sem nenhum feriado :( ` } 
    }
    
    let todayHoliday = todayHolidayLength[Math.floor(Math.random() * todayHolidayLength.length)].title
    
    return { reply: `hoje é ${todayDate}, ${todayHoliday}!` }
  }
  
  let sender = args[0].toLowerCase();
  
  let dateSearch = feriados.filter(i => i.dateS === sender);
  let titleSearch = feriados.filter(i => i.title.toLowerCase() === sender);
  
  let allSearch = dateSearch.length || titleSearch.length
  
  if(!allSearch) {
   return { reply: `Não encontrei essa comemoração/data :/` } 
  }
  
  if(dateSearch.length) {
    
    let randomDate = dateSearch[Math.floor(Math.random() * dateSearch.length)];
    let randomDateTitle = randomDate.title;
    let randomDateTime = new Date(`${randomDate.date}/2021`).getTime()
    
    if(currentDate > randomDateTime) {
     let pastDate = ms(currentDate - randomDateTime, {secondsDecimalDigits: 0, unitCount: 2}); 
     return { reply: `essa data foi marcada pelo ${randomDateTitle}, há ${pastDate}` } 
    } else {
      let afterDate = ms(randomDateTime - currentDate, {secondsDecimalDigits: 0, unitCount: 2}); 
     return { reply: `essa data irá ser marcada pelo ${randomDateTitle}, daqui ${afterDate}` } 
    }
    
  }
  
  if(titleSearch.length) {
   
    let titleSearchTitle = titleSearch.title;
    let titleSearchDate = new Date(`${titleSearch.date}/2021`).getTime();
    
    if(currentDate > titleSearchDate) {
     let pastDate = ms(currentDate - titleSearchDate, {secondsDecimalDigits: 0, unitCount: 2}); 
     return { reply: `essa comemoração ocorreu em ${titleSearch.date}, há ${pastDate}` } 
    } else {
      let afterDate = ms(titleSearchDate - currentDate, {secondsDecimalDigits: 0, unitCount: 2}); 
     return { reply: `essa comemoração irá ocorrer em ${titleSearch.date}, daqui ${afterDate}` } 
    }
    
  }
  
}

module.exports.config = {
 name: 'feriado',
 aliases: ['fd'],
 description: 'Mostra o feriado de hoje ou um específico.',
 usage: 'feriado [Natal|25/12]',
 cooldown: 5000,
 level: 'Todos'
}