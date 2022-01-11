module.exports.run = async ({args}) => {
  
  let feriados = require('../data/feriados.json');
  const moment = require('moment-timezone');
  const ms = require('pretty-ms');
  const chrono = require('chrono-node')
  
  const currentDate = moment().tz('America/Bahia').format().slice(0, 19);
  const currentDateMs = new Date(currentDate).getTime();
  
  function convertTZ(date, tzString) {
    return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {timeZone: tzString}));   
}

  
  if(!args[0]) {
    
    let todayMonth = new Date(currentDate).getMonth() + 1;
    let todayDay = new Date(currentDate).getDate();
   
    
    let todayDate = `${todayDay.toString().padStart(2, "0")}/${todayMonth.toString().padStart(2, "0")}`
    
    let todayHolidayLength = feriados.filter(i => i.date === todayDate);
    
    if(!todayHolidayLength.length) {
     return { reply: `hoje é ${todayDate}, sem nenhum feriado :( ` } 
    }
    
    let todayHoliday = todayHolidayLength.sort(i => 0.5 - Math.random())[0]
    
    return { reply: `hoje é ${todayDate}(${todayHoliday.week}), ${todayHoliday.title}!` }
  }
  
  let sender = args.join(' ').toLowerCase();
  const dateParsed = await chrono.pt.parseDate(sender)
  let dateSearch = [];
  if(dateParsed) {
      dateSearch = feriados.filter(i => i.date === `${dateParsed.getDate().toString().padStart(2, "0")}/${(dateParsed.getMonth()+1).toString().padStart(2, "0")}`);
  }
  let titleSearch = feriados.filter(i => i.title.toLowerCase() === sender);
  
  let allSearch = dateSearch.length || titleSearch.length
  
  if(!allSearch) {
   return { reply: `Não encontrei essa comemoração/data :/` } 
  }
  
  if(dateSearch.length) {
    
    let randomDate = dateSearch.sort(i => 0.5 - Math.random())[0]
    let randomDateTitle = randomDate.title;
    let randomDateTime = moment.tz(new Date(`${randomDate.date}/2021`), 'America/Bahia').format().slice(0, 19);
    let randomDateWeek = randomDate.week;
    randomDateTime = new Date(randomDateTime).getTime() + 10800000;
    
    if(currentDateMs > randomDateTime) {
     let pastDate = ms(currentDateMs - randomDateTime , {secondsDecimalDigits: 0, unitCount: 2}); 
     return { reply: `essa data foi marcada como ${randomDateTitle}(${randomDateWeek}), há ${pastDate}` } 
    } else {
      let afterDate = ms(randomDateTime - currentDateMs , {secondsDecimalDigits: 0, unitCount: 2}); 
     return { reply: `essa data irá ser marcada como ${randomDateTitle}(${randomDateWeek}), daqui ${afterDate}` } 
    }
    
  }
  
  if(titleSearch.length) {
   
    let titleSearchDay = titleSearch[0].dateS
    let titleSearchWeek = titleSearch[0].week
    let titleSearchDate = moment.tz(new Date(`${titleSearch[0].date}/2021`), 'America/Bahia').format().slice(0, 19);
    titleSearchDate = new Date(titleSearchDate).getTime() + 10800000;
    
    
    if(currentDateMs > titleSearchDate) {
     let pastDate = ms(currentDateMs - titleSearchDate, {secondsDecimalDigits: 0, unitCount: 2}); 
     return { reply: `essa comemoração ocorreu em ${titleSearchDay}(${titleSearchWeek}), há ${pastDate}` } 
    } else {
      let afterDate = ms(titleSearchDate - currentDateMs, {secondsDecimalDigits: 0, unitCount: 2}); 
     return { reply: `essa comemoração irá ocorrer em ${titleSearchDay}(${titleSearchWeek}), daqui ${afterDate}` } 
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
