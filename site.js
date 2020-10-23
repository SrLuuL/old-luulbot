const PORT = process.env.PORT || 3000;

const express = require('express');
const app = express()


app.get('/', (req, res) => {
res.send(`<html lang='pt'>





</html>
`)
})

app.listen(PORT, () => {
console.log('Servidor rolando!')
})
