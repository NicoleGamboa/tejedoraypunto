const {Pool} = require("pg");


// conexion base de datos por uri
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:belen2393@localhost:5432/tejedoraypunto'

// operador ternario para trabajar con heroku
const pool = process.env.DATABASE_URL ? 
    new Pool({
        connectionString,
        ssl: {rejectUnauthorized: false}
    }) :
    new Pool({connectionString})