const socketio = require('socket.io');
var io;

function handler(socket) {

    console.log('new connection', socket.id);

    socket.on('otros', (data) => {
        console.log(data);
        io.emit('hi:response', "HOLA2");
    });


    socket.on('load', function (data) {
        require("./serial").start(socket,io,data);
    });



}

module.exports = {

    start: (server) => {
        io = socketio.listen(server);
        io.on('connect', (socket) => {
             handler(socket)
        });
    
    }

}