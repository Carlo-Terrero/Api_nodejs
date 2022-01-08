/* Modelos(obejeto) de articulos */
'use strict'

//Cargamos módulos
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Definimos la estructura del objeto(aqui definimos el tipo de dato)
var ArticleSchema = Schema({
    title: String,
    content: String,
    date: {type: Date, default: Date.now },
    image: String
})

/* Lo exportamos para poder importarlo en los modulos que lo necesitemos,
tanto para crear nuevos obj, como interactuar con  el conectandote a la bbdd(coleccion) */

//Pasamos el nombre el objeto y luego el esquema de la bbdd(coleccion)
//Cuando creas el obj se hace en singular, pero mongoose lo vuelve plural
module.exports = mongoose.model('Article', ArticleSchema);