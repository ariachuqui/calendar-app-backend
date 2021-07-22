const express = require('express');
require('dotenv').config();
const cors = require('cors');


const { dbConnection } = require('./database/config');

//Crear el servidor de express
const app = express();

//Database
dbConnection();

//CORS
app.use(cors());

//Directorip público
app.use( express.static('public') );

//Lectura y parseo deo body
app.use( express.json() );

//Rutas
app.use('/api/auth', require('./routers/auth'));
app.use('/api/events', require('./routers/events'));



//Esucchar peticiones, de 3001 para adelante
app.listen(process.env.PORT, () => {
    console.log(`servidor corriendo en puerto ${process.env.PORT}`)
} )