const staticServer = require('./static-server'),
    querystring = require('querystring'),
    mongo = require('mongodb').MongoClient;

//Coneccion mediante el puerto y
//el nombre de la bd
var url = 'mongodb://localhost:27017/store';

var getPostRoot = function (req, res) {
    if (req.method === "POST") {
        var postData = "";


        req.on("data", function (dataChunk) {
            postData += dataChunk;

            if (postData.length > 1e6) {
                console.log("> Actividad maliciosa detectada por parte de un cliente");
                req.connection.destroy();
            }

            req.on("end", function () {
                res.writeHead(200, {
                    'Content-Type': 'text/html'
                });

                console.log(`> Data Recived: ${postData}`.data);
                var data = querystring.parse(postData);

                res.write(`<link rel="stylesheet" href="vendor/sweetalert/dist/sweetalert.css">
                <script src="vendor/sweetalert/dist/sweetalert.min.js"></script>`)

                res.write('<ul>');
                for (var key in data) {
                    if (Object.prototype.hasOwnProperty.call(data, key)) {
                        res.write(`<body style="background: #D8D8D8">`+
                        `<li><h3>${key.toString().toUpperCase()} : ${data[key]}</h3></li></body>`,{
                            'Content-Type': 'text/html'
                        });
                    }
                }

                mongo.connect(url, function (err, db) {
                    console.log("mongo");
                    if (err) {
                        res.end(`<script>sweetAlert("ERROR", "El resultado de la operacion no fue exitoso", "error");</script>`)
                    } else {
                        var collection = db.collection('stock');
                        collection.insert(querystring.parse(postData), function (err, data) {
                            if (err) {
                                throw err;
                                res.write(`<script>sweetAlert("ERROR", "No se pudo registrar en la DB", "error");</script>`)
                            };
                            console.log("script");
                            res.write(`<script>sweetAlert("OK", "Registro guardado exitosamente en la DB", "success");</script>`);
                            db.close();
                            res.end();
                        });
                    }
                });
                console.log("end");
                res.write(`</ul> <a href="stock.html" target="_self"> <input type="button" name="boton" value="Revisar Stock" /> </a> `)
            });
        });
    } else {
        staticServer.server(req, res);
    }
}

var getitems = function (req, res) {
    res.writeHead(200, {
        "Content-Type": "text/html"
    });
    mongo.connect(url, function (err, db) {
        var collection = db.collection('stock');
        collection.find().toArray(function (err, items) {
            console.log(items);
            if (err) throw err;
            res.write('<link rel="stylesheet" href="vendor/bootstrap/dist/css/bootstrap.css">');
            for (var item in items) {
                res.write('<div class="container col-md-3"><ul>')
                for (var key in items[item]) {
                    if (Object.prototype.hasOwnProperty.call(items[item], key)) {
                        res.write(`<body style="background: #F2F2F2">`+
                        `<li>${key.toString().toUpperCase()} : ${items[item][key]}</li></body>`);
                    }
                }
                res.write('</ul></div>')
            }
            res.end(`</ul> <a href="formulario.html" target="_self"> <input type="button" name="boton" value="Regresar a Formulario" /> </br>`);
        });
        db.close();
    });
}

var handlers = {};

handlers["/formulario"] = getPostRoot;
handlers["/stock.html"] = getitems;
module.exports = handlers;