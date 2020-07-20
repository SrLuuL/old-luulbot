module.exports.run = (client, message, args, username, channel) => {
  const db = require("quick.db")
  const unirest = require("unirest")
  let query;
  
 if (!args[0] && db.get(`${username}_weather) !== null ) {
   query = db.get(`${username}_weather)
     } else {
     query = args.join(" ")
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
  
  if(args[0] == "--set" && args[1]) {
    db.set(`${username}_weather, `args.join(" ").slice(args[0].length)
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
