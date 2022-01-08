
'use strict'

var express = require('express');
var ArticleController = require('../controllers/article');

var route = express.Router();

var multiparty = require('connect-multiparty');
var md_upload = multiparty({ uploadDir: './upload/articles'}); // Esta es la configuracion principal (es un midelwere)

// --> Rutas de prueba
//Seleccionamos la accion http (post, get, etc), luego la ruta y el metodo, el cual lo adquirimos del objeto nameObjController.
route.post('/test-de-controlador', ArticleController.datosCurso);
route.get('/datos-curso',ArticleController.test);

// --> Rutas útiles
route.post('/save', ArticleController.save);
route.get('/articles/:last?', ArticleController.getArticles); //el parametro :last? hace que se vuelva opcional que se ponga en la url
route.get('/article/:id', ArticleController.getArticle);
route.put('/article/:id', ArticleController.update);
route.delete('/article/:id', ArticleController.delete);
route.post('/upload-image/:id', md_upload, ArticleController.upload); //Ahora esta ruta acepta archivos que se le envien.

// lo Exportamos
module.exports = route;

// Ruta o metodo de prueba para el API REST (es muy similar a python)
/*@app.route('/guide', methods=["POST"])
  def add_guide():
      print('hola mundo')  */

/*
app.get('/probando', (req, res) =>{
    //la funcion send, nos permite devolver un objeto json o html entre ``
    return res.status(200).send({
        curso: 'Framework JS',
        autor: 'Carlos Terrero',
        contacto:  'carlos@gmail.com'
    })
})

arriba se muestra el mismo ejemplo, pero exportando el controlador(metodos) desde el objeto
importado con estas, para no ponerlo todo junto y que sea mas legible.

*/