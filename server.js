var http = require('http');
var Static = require('node-static');
var Type = require('type-of-is');
var WebSocketServer = new require('ws');

var clients = {};

var webSocketServer = new WebSocketServer.Server({port: 8081});
webSocketServer.on('connection', function (ws) {

    var id = Math.random();
    clients[id] = ws;
    console.log("New connection " + id);


    ws.on('message', function (message) {
        if (message.length < 100) {
            console.log("Current download speed is: " + message + " Mbp/s\n");
            //console.log('File received  ' + message);
        } else {
            for (var key in clients) {
                clients[key].send('File sent successfully ');
            }
        }
    });

    ws.on('close', function () {
        console.log('Connection closed ' + id);
        delete clients[id];
    });

});

var fileServer = new Static.Server('.');
http.createServer(function (req, res) {

    fileServer.serve(req, res);

}).listen(8082);

console.log("Server in up on ports: 8082, 8081");

