const Serialport = require('serialport');
let com = {};
const functions = require('../functions');
let lenghtserial = 17;
let serialon = false;
const Buffer = require('buffer').Buffer;
const buf = Buffer.from([0x0d]);


function init(socket, io, data) {

    console.log("SERIAL");
   
    let word = "";

    if (!serialon) {
        serialon = true;
        io.emit(data.name+':response', 'Serial Waiting');

        const port = new Serialport(data.port, {
            baudRate: data.baudRate,
            dataBits: data.dataBits,
            parity: data.parity,
            stopBits: data.stopBits,
            flowControl: data.flowControl
        });

        port.on('open', function () {
            console.log('Conected Serial');
        });


        port.on('data', function (dataclient) {
            // console.log(dataclient);
            word = word.concat(dataclient.toString());
            if (dataclient.toString() == buf.toString()) {
                const peso = functions.weight(word)
                if (peso.gross.length > 5) {
                    io.emit(data.name+':response', peso);
                }
                word = "";
            }
    
     
            // if (word.length > (lenghtserial - 1)) {
            //     const peso = functions.weight(word)
            //     if (peso.gross.length > 5) {
            //         io.emit(data.name+':response', peso);
            //     }
            //     console.log(word);
            //      word = "";
            // }
        });


        port.on('error', function (err) {
            console.log(err);
            console.log("Error en serial");
            io.emit(data.name+':response', 'close');
            serialon = false;
        });

        port.on('close', function (err) {
            console.log("Error en serial");
            io.emit(data.name+':response', 'close');
            serialon = false;
        });

    }
 
}

// function handler(socket, io,data){
//     socket.on('serial:call', function (data) {

//         if (!serialon) {
//             serialon = true;
//             io.emit('serial:response','Serial Waiting');
//             const port = new Serialport('/dev/tty.usbserial', {
//                 baudRate: 9600,
//                 dataBits: 8,
//                 parity: 'none',
//                 stopBits: 1,
//                 flowControl: false
//             });
//             port.on('open', function () {
//                 console.log('Conected Serial');
//             });

//             const ByteLength = Serialport.parsers.ByteLength;
//             const parser = port.pipe(new ByteLength({
//                 length: 20
//             }));
//             parser.on('data', function (data) {
//                 const peso = weight(data);
//                 if (peso.length > 5) {
//                     io.emit('serial:response', `${peso} kg`);
//                 }
//             });

//             parser.on('error', function (data) {
//                 console.log("Error en serial");
//                 io.emit('serial:response', 'serial close');
//                 serialon = false;
//             });

//             port.on('error', function (err) {
//                 console.log("Error en serial");
//                 io.emit('serial:response', 'serial close');
//                 serialon = false;
//             });

//             port.on('close', function (err) {
//                 console.log("Error en serial");
//                 io.emit('serial:response', 'serial close');
//                 serialon = false;
//             });

//         }
//     });
// }

module.exports = {
    start: (socket, io,data) => {
        init(socket, io,data)
    }
}