/* Creamos el servidor aqui, para procesar peticiones y repuestas HTTP */
'use strict'

// Cargamos modulos para crear servidor
var express = require('express');   //--> Este modulo nos permite crear el server.
var bodyParser = require('body-parser')  //-->para recibir las petisiones y volver esos datos a un objeto nativo de JS.


// Ejecutar express (http)
var app = express(); 

// Cargar ficheros - rutas (Hecho aparte para que el codigo sea mas legible)
var article_routes = require('./routes/article')


// Middlewares -> se ejecuta antes de cargar una ruta o una url de la app
app.use(bodyParser.urlencoded({extended:false}));   //creamos o ejecutamos el middleware, basecamente cargamos el bodyParser/utilizarlo.
app.use(bodyParser.json());    //Convertimos las peticiones de datos a json


// CORS -> para permitir peticiones del frontend


// añadir prefijos a rutas / cargar rutas
//Hacemos esto para que se puedan utilizar todas la rutas de ede obj.
// app.use('/', article_routes); las dos son validas
// app.use(article_routes); //pero pondremos esta de abajo
app.use('/api', article_routes);


// Ruta o metodo de prueba para el API REST (es muy similar a python)



// Exportar modulo (fichero actual) para poder usar este objeto fuera y cargar app.js en el indel.js
module.exports = app;