const { Client } = require("pg");
const connectionURI = process.env.DATABASE_URL += '?ssl=true&sslfactory=org.postgresql.ssl.NonValidatingFactory';



const db = new Client({connectionString: connectionURI})

db.connect()
.catch(err => {console.log(err)});

db.on("error", (err) => {console.log(err)});

module.exports = {db}
