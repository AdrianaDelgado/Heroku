// Caragr el modulo HTTP
var http = require('http');
//Cargar el modulo fs, para leer archivos
var fs = require('fs');
// Cargando mudlo path, para administrar rutas
var path = require('path');
// cargando colors
var colors = require('colors');
// Caragado el modulo mime
var mime = require('mime');

//--> Cargando configuracion
var config = require("./config/config");

// Importado los Handlers
var handlers = require('./internals/handlers');

//Importo la funcionalidad del aervidor estatico
var staticServer = require('./internals/static-server')
// Establcer tema de colores
colors.setTheme(config.color_theme);

// Crear el server
var server = http.createServer(function(req, res) {
      //Logeando peticion
    console.log(`> Peticion entrante ${req.url}`.data);
    // Variable que almcenara la ruta absoluta del archivo
    // a ser servido
    var resourcePath;
    //Ver si es una accion que tengo que hacer
    //verificando si la url corresponde
    // a un comando de mi API(AUTOR, SERVER)
    if (typeof(handlers[req.url]) == 'function') {
         //Existe el manejador en mi API
        //Entonces mando a ejecutar el manejador 
        //con los parametros que piede
        handlers[req.url](req, res);
    } else {
        //No existe el manejador en mi API
        //Entonces intento servir la url
        //como un recurso estatico
        staticServer.server(req, res);
    }

});
//Poniendo en ejecucion el server
server.listen(config.PORT, config.IP, function() {
    console.log(`> Server escuchando en http://${config.IP}:${config.PORT}`.info);
});