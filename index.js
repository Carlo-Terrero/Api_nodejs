/* Fichero principal de dende corre toda la app */
'use strict' //hace que sea mas estricto y añade algunas mejoras.

/*Cargamos los modulos de js */
var mongoose = require('mongoose')
var app = require('./app') //Asi importamos lo modulos que hemos hecho nosotros
var port = 3900; //


//mongoose.set('useFindAndModify', false);    //Desactivamos metodos antiguos de la bbdd
mongoose.Promise = global.Promise;  //Promesas
//conexion a mongoDB (con promesas)
mongoose.connect('mongodb://localhost:27017/Prurba_api_node' , { useNewUrlParser: true})
    .then(() => {
        console.log('conexion exitosa')

        // Crear servidor y ponerme a escuchar peticiones HTTP
        app.listen(port, () =>{
            console.log('server corriendo en http://localhost:'+port);
        })
    })
