//Funcionalidad de servidor estatico

//importando librerias-dependencia

var fs = require('fs'),
    mime = require('mime'),
    path = require('path'),
    config = require('../config/config');

//Exportando funcionalidad de
// servidor estatico
exports.server = function(req, res) {
    var resourcePath = config.STATIC_PATH + req.url;
    if (req.url == "/") {
        //El cliente no especifica
        //recurso
        resourcePath = 'static/formulario.html';
    } else {
        //Obteniendo la ruta
        //absoluta del recurso que se desea
        //servir
        resourcePath = path.resolve(resourcePath);
    }
    console.log(`Recurso solicitado: ${resourcePath}`.data);

    //Extratendo la extension de la url
    var extName = path.extname(resourcePath);

    //Crenado la variable content.type,
    //Aignando un content type depenciendo
    // de la exptencion de la url solicitada
    var contentType = mime.lookup(extName);

    fs.exists(resourcePath, function(exists) {
         //si existe hay que guaerdarla
        if (exists) {
            console.log("> El recurso existe...".info);
             //El recurso existe y se intentara leer
            fs.readFile(resourcePath, function(err, content) {
                //Verifico si hubo un error en la lectura
                if (err) {
                    resourcePath = 'static/500.html';
                    console.log("> Error en la lectura de recurso".error);
                   //Hubo un error
                     res.writeHead(500,{
                        'content-Type' :'text/html'
                    });
                    res.end('<h1>500: Error interno</h1>');
                }else{
                    console.log(`>Se despacha recurso: ${resourcePath}`.info);
                    //No hubo error
                    //Se contesta el contenido al cliente
                    res.writeHead(200,{
                        'content-Type' : contentType,
                        'Server' : 'ITGAM@0.0.1'
                    });
                    res.end(content,'utf-8');
                }
            });

        }else{
            console.log('El recurso solicitado no fue encontrado...'.info);
            //El recurso no existe-- error 404
            res.writeHead(404,{
                'content-Type' : contentType,
                'Server' : 'ITGAM@0.0.1'
            });
            res.end('<h1>404: Not Found</h1>');
        }
            
    });
}