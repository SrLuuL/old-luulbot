module.exports.run = (client, message, args, username, channel) => {
  const db = require("../clients/database.js").db
  const unirest = require("unirest")
  let query;
  

  
  if(args[0] == "--set" && args[1]) {
    db.query(`ALTER TABLE userWeather ADD ${username}Weather varchar(255)`)
    db.query(`INSERT INTO userWeather(${username}Weather) VALUES(${args.join(" ").slice(args[0].length)})`)
    return client.say(channel, `${username}, local setado!`)
  } 
  
  
  if (args[0] && !args[0].startsWith("-")) {
    query = args.join(" ")
  }
  
 if (!args[0]) {
   if (db.query(`SELECT ${username}Weather FROM userWeather`) === `error: column "${username}" does not exist`) {
     return client.say(channel, `${username}, informe ou define um local :/`)
   } else {
     query = db.query(`SELECT ${username}Weather FROM userWeather`)
                  
   }
 } 

if (args[0]) {  
if (args[0].startsWith("$")) {
if(!db.query(`SELECT ${args[0].slice(1)}Weather FROM userWeather`)) {
return client.say(channel, `${username}, este usuário não setou seu local :/`)
} else {
 query =  db.query(`SELECT ${args[0].slice(1)}Weather FROM userWeather`)
}
}
}
                                                                                                                                                 
                                                                                                                                                                                                              

  
  var req = unirest("GET", `http://api.openweathermap.org/data/2.5/weather`)

  req.query({
    "q": query,
    "lang": "pt",
    "units": "metric",
    "appid": "0792471e43eab7bc91245dfcb71d43ec"
  })
  
  
  
  req.end(function (res){
 try{
  
  let clima = res.body.weather[0].description
  let id = res.body.weather[0].id
  let temp = res.body.main.temp
  let feel = res.body.main.feels_like
  let humidity = res.body.main.humidity
  let wind = res.body.wind.speed
  let country = res.body.sys.country
  let name = res.body.name
  let main = res.body.weather[0].main

  
  
  switch (main) {
    case "Thunderstorm":
      main = "\u{26C8}"
      break;
    case "Drizzle":
      main ="\u{1F327}"
      break;
    case "Rain":
      main ="\u{1F327}"
      break;
    case "Snow":
   main = "\u{1F328}"
   break;
    case "Atmosphere":
      main = "\u{1F328}"
      break;
    case "Mist":
      main = "\u{1F328}"
      break;
    case "Clear":
      main = "\u{2600}"
      break;
    case "Clouds":
    main = "\u{2601}"
    break;
      
      
  }
  
 
  
  client.say(channel,`${username}, ${name}(${country}) ${clima} ${main}, ${temp}° com sensação de ${feel}°, ${humidity}% de humidade e ventos a ${wind} m/s \u{1F343}`)
   
 } catch (err) {
   client.say(channel,`${username}, local inválido :/`)
 }
   
  })
  
  
  
}


module.exports.config = {
  name: "weather",
  aliases: ["clima"],
  description: "Mostra o clima em determinado local",
  usage: "weather [local]"
}
