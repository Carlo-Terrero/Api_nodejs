/*En esta clase vamos a tener los diferentes metodos y rutas relacionados con articulos del backend. */
'use strict'

var validator = require('validator'); // importamos el modulo con el que vamos validar el dato.
const article = require('../models/article');
var Article = require('../models/article'); //Con este modelo (objeto) vamos crear y guardar los objetos en la base de datos.

/*Se pueden crear metodos por separado, pero parece mas optimo crear un objeto. Definiremos sus propiedades y dentro de estas 
una funcion anónima, así al llamar a la propiedad se ejecuta la función*/
var controller = {

    datosCurso: (req, res) => {
        //la funcion send, nos permite devolver un objeto json o html entre ``
        return res.status(200).send({
            curso: 'Framework JS',
            autor: 'Carlos Terrero',
            contacto:  'carlos@gmail.com'
        })
    },

    test: (req, res) => {
        return res.status(200).send({
            message: 'Soy la accion test de mi controlador de articulos'
        });
    },

    //Método para agregar 
    save: (req, res) => {
        // Recoger parametros por post
        var params = req.body;
        
        // Validar datos (Validator). Los datos suelen probocar errores y con un try los solventaremos
        try{ // -> Estas variables daran true cuando no esten vacios los campos de cada una.
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
            
        }catch(err){
            return res.status(200).send({
                status: 'Error',
                message: 'Faltan datos por enviar !!'
            });
        }

        if(validate_title && validate_content){
            
            // crear el objeto a guardar o instanciar el modelo
            var article = new Article();

            // Asigar valores
            article.title = params.title;
            article.content = params.content;
            article.image = null;

            // Guardar el articulo(Ha este metodo le pasamos un error en caso de que succeda, y el articleStored por si se ha guardado)
            article.save((err, articleStored) => {

                if(err || !articleStored){
                    return res.status(404).send({
                        status:'Error',
                        message: 'Ha habido un error al guardar el articulo'
                    });
                }

                // Devolver una respuesta
                return res.status(200).send({
                    status: 'Success',
                    article: articleStored
                });

            });


        }else{
            return res.status(200).send({
                status: 'Error',
                message: 'Los datos no son validos !!!'
            })
        }

    },

    getArticles: (req, res) => {

        var query = Article.find({});//Las func principal de busqueda la metemos en una variable para que sea mas llamar mas funciones.

        // Gestion de parametro :last? (parametro opcional) en este caso se usa para limitar los elementos de get.
        var last = req.params.last
        if(last || last !=undefined) {
            query.limit(5);
        }

        // Find es la funcion para optener los datos de la base de datos. Si te fijas es lo mismo que una consulta directa.
        // .exec, esta funcion no me queda claro del todo, pero es la que gestiona la busqueda.
        // Se gestiona igual que que la funcion save.
        // Con .sort(-_id), ser ordena mas mas nuevo a mas viejo.
        query.sort('-_id').exec((err, articles) => {

            if(err){
                return res.status(500).send({
                    status: 'Error',
                    message: 'Error al decolver los articulos !!!'
                });
            }

            if(!articles){
                return res.status(404).send({
                    status: 'Error',
                    message: 'No hay articulos para mostrar !!!'
                });
            }

            return res.status(200).send({
                status: 'Success',
                articles
            });
        })        
    },

    getArticle: (req, res) => {
        
        Article.find({}).exec((err, article) => {

            // Recoger el id de la url
            var articleId = req.params.id;
    
            // Comprobar que existe
            if(!articleId || articleId == null){
                return res.status(404).send({
                    status: 'error',
                    message: 'Articulo no existente'
                });
            }

            // Buscar el articulo
            Article.findById(articleId, (err, article) => {

                if(err || !article){
                    return res.status(404).send({
                        status: 'error',
                        message: 'Articulo no existente'
                    });
                }

                // Devolverlo en json
                return res.status(404).send({
                    status: 'Success',
                    article
                });

            })
           

        })
    },

    update: (req, res) => {
        
        Article.find({}).exec((err, article) => {
            
            // Recoger el ide del articulo por url
            var articleId = req.params.id;

            // Recoger los datos que llegan por put
            var params = req.body;

            // Validar datos
            try{
                var validate_title = !validator.isEmpty(params.title);
                var validate_content = !validator.isEmpty(params.content);                
            }catch(err){
                return res.status(404).send({
                    status: 'error',
                    message: 'Faltan datos por enviar !!!'
                });
            }

            if(validate_title && validate_content){
                // Find and update
                Article.findOneAndUpdate({_id: articleId}, params, {new:true}, (err, articleUpdated) => {
                    if(err){
                        return res.status(500).send({
                            status: 'Error',
                            message: 'Error al actualizar !!!'
                        });
                    }

                    if(!articleUpdated){
                        return res.status(404).send({
                            status: 'Error',
                            message: 'No existe el articulo !!!'
                        })
                    }

                    return res.status(200).send({
                        status: 'success',
                        article: articleUpdated
                    })

                })
            }else{
                // Devolver respuesta
                return res.status(404).send({
                    status: 'error',
                    message: 'La validacion no es correcta !!!'
                });
            }                     
        })        
    }

}; // end controller

module.exports = controller;