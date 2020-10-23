const PORT = process.env.PORT || 3000;

const express = require('express');
const app = express();
const luulbot = require('./clients/discord.js').luulbot;


app.get('/comandos', (req, res) => {
  
  let commandList = luulbot.commands.map(i => `
<tr>
<td><a>${i.config.name}</a></td>
</tr>
`
  
  
res.send(`
<html lang='pt'>





</html>
`)
})

app.listen(PORT, () => {
console.log('Servidor rolando!')
})
