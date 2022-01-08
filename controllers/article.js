/*En esta clase vamos a tener los diferentes metodos y rutas relacionados con articulos del backend. */
'use strict'

var validator = require('validator'); // importamos el modulo con el que vamos validar el dato.
var fs =  require('fs');//Nos permita borrar archivos de nustros ficheros.
var path = require('path'); //Es de modulo de node para sacar el path o la ruta de un archivo en el sistema de archivos de servidor.

var Article = require('../models/article'); //Con este modelo (objeto) vamos crear y guardar los objetos en la base de datos.
const { exists } = require('../models/article');

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
    },

    delete: (req, res) => {
        // Recoger id de la url
        var articleId = req.params.id;

        // Find and delete
        Article.findOneAndDelete({ _id: articleId}, (err, articleRemoved) => {
            if(err){
                return res.status(500).send({
                    status: 'Error',
                    message: 'Error al borrar'
                })
            }

            if(!articleRemoved){
                return res.status(404).send({
                  status: 'Error'  ,
                  message: 'No se ha borrado el artículo, posiblemente no exista !!!'
                });
            }

            return res.status(200).send({
                status: 'Success',
                article: articleRemoved
            })
        });

        
    },

    // Metodo de subida de archivo
    upload: (req, res) => {
        // Configurar el modulo connect multiparty router/article.js
        // Este paso se hace en el archivo de rutas/articles.js

        // Recoger el fichero de la peticion.
        var file_name = 'Imagen no subida...';

        if(!req.files){
            return res.status(404).send({
                status: 'Error',
                message: file_name
            })
        }

        // Conseguir nombre y la extension del archivo
        var file_path = req.files.file0.path;
        var file_split = file_path.split('\\'); //Así dividimos el path por las \\ y tenemos tantos elementos como este divisores tenga el path

        // -- OJO -- ADVERTENCIA, EN LINU>X O MAC sería:
        // var file_split = file_path.split('/');

        // Nombre de archivo, se usara para guardalo en la bbdd(coleccion)
        var file_name = file_split[2];

        // Extension del fichero (png, jpg...)
        var extension_split = file_name.split('\.');
        var file_ext = extension_split[1]; // Se comprobara el tipo de dato para ver si es valido

        // Comprobar la extension, solo imagenes, si es valida borrar el fichero
        if(file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif'){
            
            // borrar el archivo subido en caso de que la extencion no sea como las arriba puestas.
            // Esto se hace porque con el multiparti se sube todo directamente
            fs.unlink(file_path, (err) => {
                return res.status(200).send({
                    status: 'Error',
                    message: 'La extencion de la imagen no es valida'
                });
            });

        }else {
            // Si todo es valido, sacamos id de la url
            var articleId = req.params.id

            //Buscar el articulo, asignarle el nombre del la imagen y actualizarlo
            Article.findOneAndUpdate({_id: articleId}, {image: file_name}, {new:true}, (err, articleUpdated) => {
                
                if(err || !articleUpdated){
                    return res.status(200).send({
                        status: 'Error',
                        message: 'Error al guardar la imagen de articulo'
                    })
                }

                return res.status(404).send({
                    status: 'Success',
                    article: articleUpdated
                });
            });

            
        }
    }, // end upload file

    getImage: (req, res) => {
        var file = req.params.image;
        var path_file = './upload/articles/' + file

        //Comprobamos si el archivo existe
        //El segundo parametro de de la mayoria de los metodos son funciones de callBack () => {} ó (req, res) => {}
        fs.exists(path_file, (exists) => {
            if(exists){
                return res.sendFile(path.resolve(path_file));
            }else{
                return res.status(404).send({
                    status: 'Error',
                    message: 'La imagen no existe'
                });
            }            
        });
    },

}; // end controller

module.exports = controller;