module.exports.run = async ({args}) => {
  
  const feriados = require('../data/feriados.json');
  const moment = require('moment-timezone');
  const ms = require('pretty-ms');
  
  const currentDate = moment().tz('America/Bahia').valueOf();
  
  let sender = args[0].toLowerCase();
  
  if(!sender) {
    
    let todayMonth = new Date().getMonth() + 1;
    let todayDay = new Date().getDate();
   
    
    let todayDate = `${todayDay.toString().padStart(2, "0")}/${todayDay.toString().padStart(2, "0")}`
    
    let todayHolidayLength = feriados.filter(i => i.dateS === todayDate);
    
    let todayHoliday = feriados.filter(i => i.dateS === todayDate)[Math.floor(Math.random() * todayHolidayLength.length)].title
    
    return { reply: `hoje é ${todayDate}, ${todayHoliday}!` }
  }
  
  let dateSearch = feriados.filter(i => i.dateS === sender);
  let titleSearch = feriados.find(i => i.title.toLowerCase() === sender);
  
  let allSearch = dateSearch || titleSearch;
  
  if(!allSearch) return { reply: `Não encontrei essa comemoração/data :/` };
  
  if(dateSearch) {
    
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
  
  if(titleSearch) {
   
    let titleSearchTitle = titleSearch.title;
    let titleSearchDateS = titleSearch.date;
    let titleSearchDate = new Date(`${titleSearchDate.date}/2021`).getTime();
    
    if(currentDate > titleSearchDate) {
     let pastDate = ms(currentDate - titleSearchDate, {secondsDecimalDigits: 0, unitCount: 2}); 
     return { reply: `essa comemoração ocorreu em ${titleSearchDate}, há ${pastDate}` } 
    } else {
      let afterDate = ms(titleSearchDate - currentDate, {secondsDecimalDigits: 0, unitCount: 2}); 
     return { reply: `essa comemoração irá ocorrer em ${titleSearchDate}, daqui ${afterDate}` } 
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
