module.exports.run = async (client, message, args, username, channel) => {
  const db = require("../clients/database.js").db
  const unirest = require("unirest")
  let query;
  
                                                                                                                                         
                                                                                                                                                                                                              

  
  var req = unirest("GET", `http://api.openweathermap.org/data/2.5/weather`)

  req.query({
    "q": query,
    "lang": "pt",
    "units": "metric",
    "appid": "0792471e43eab7bc91245dfcb71d43ec"
  })
  
  
   let userWeather = await db.query(`SELECT * FROM user_weather WHERE userchannel='${username}'`);


  if(args[0] == "--set" && args[1]) {
  if (args[2] == "--hide") {
    if (!userWeather.rows[0].hidden) {
     await db.query(`UPDATE user_weather SET hidden='1' WHERE userchannel='${username}'`)
    } else {
     await db.query(`INSERT INTO user_weather(hidden) VALUES('1') WHERE userchannel='${username}'`)
    }
  } else {
    if (!userWeather.rows[0].hidden) {
     await db.query(`UPDATE user_weather SET hidden='0' WHERE userchannel='${username}'`)
    } else {
     await db.query(`INSERT INTO user_weather(hidden) VALUES('0') WHERE userchannel='${username}'`)
    }
  }
    if (!userWeather.rows[0].userplace) {
      await db.query(`UPDATE user_weather SET userplace='${args.join(" ").slice(args[0].length)}' WHERE userchannel='${username}'`)
    } else {
      await db.query(`INSERT INTO user_weather(userplace) VALUES('${args.join(" ").slice(args[0].length)}') WHERE userchannel='${username}'`)
    }
  } 
  
  
  if (args[0] && !args[0].startsWith("-")) {
    query = args.join(" ")
  }
  
if (!args[0]) {
  if (!userWeather.rows[0].userplace) {
    query = userWeather.rows[0].userplace
  } else {
    return client.say(channel, `${username}, insira ou defina um local :/`)
  }
}
  


if (args[0] && args[0].startsWith("$")) {
    await db.query(`SELECT place FROM user_weather WHERE userplace='${args[0].slice(1)}'`, async (err) => {if (err) return client.say(channel, `${username}, este usuário não setou um local :/`)})
                   }   
  
  
  req.end(async function (res){
 
  
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
   

   
  })
  
  
  
}


module.exports.config = {
  name: "weather",
  aliases: ["clima"],
  description: "Mostra o clima em determinado local",
  usage: "weather [local]"
}
