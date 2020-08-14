const http = require('http');
const express = require('express');
const socket = require('socket.io');
let jsonRead = require('fs');
let json = JSON.parse(jsonRead.readFileSync('./public/json/calibracion.json', 'utf8'));
let min_cua = JSON.parse(jsonRead.readFileSync('./public/json/valores_min_cua.json', 'utf8'));
console.log(json);
console.log(min_cua);

const app = express();
const server = http.createServer(app);
const io = socket(server);
let count = 0
let auxCont = 0
//Para activar la data de prueba ir a la linea 64 aprox y descomentar el setinterval

//for use terminal or cmd
const exec = require('child_process').exec;

//modo: 0 para asistido y 1 para volumen
let modo = 0;
var BPM = 0;
var IE = 1;
var IE1 = 1;
var IE2 = 1;
var IEtemp = 1;
var volumen = 1;
var presion = 1;
var th = 1;
//Stop 1 debe activar la parada de emergencia, por eso inicia en 0
var stop = 0;
//Cuando inicia se declara star en 1
var star = 0;
//Data demo
var peep = 0;
var pre1=0;
var pre2=0;
const volumenDemo = [0, 500, 0, 0, 500, 0];
const presionDemo = [0, 25, 0, 25, 0, 25];
const flujoDemo = [20, 0, 0, 20, 0, 0];

let dat1por = 1;
let dat2por = 1;
let dat1mas = 0;
let dat2mas = 0;

let m_a1 = min_cua.m_a1;
let b_a1 = min_cua.b_a1;
let m_a2 = min_cua.m_a2;
let b_a2 = min_cua.b_a2;

let user = "jd_comar";
let pass = "112233";


try {
  dat1por = json.a1c1 === undefined ? 1 :json.a1c1;
} catch (error) {
  dat1por=1;
}

try {
  dat2por = json.a1c2=== undefined ? 1 :json.a1c2;
} catch (error) {
  dat2por=1;
}


try {
  dat1mas = json.a2c1 === undefined ? 0 :json.a2c1;
} catch (error) {
  dat1mas = 0;
}
try {
  dat2mas = json.a2c2=== undefined ? 0 :json.a2c2;
} catch (error) {
  dat2mas = 0;
}

console.log("Variables: ", dat1por, dat2por, dat1mas, dat2mas);

app.use(express.static(__dirname + '/public'));

//WebSockets
// require('./websocket').start(server);

server.listen(3000, () => console.log('puerto de inicio 3000'));

const SerialPort1 = require('serialport');
const SerialPort2 = require('serialport');
const ReadLine1 = SerialPort1.parsers.Readline;
const ReadLine2 = SerialPort2.parsers.Readline;

// poner el puerto de jose
//  const port1 = new SerialPort1("COM3"), {
 const port1 = new SerialPort1("/dev/ttyUSB0", {
    baudRate: 9600
  });
  
  //  const port2 = new SerialPort2("COM7", {
 const port2 = new SerialPort2("/dev/ttyACM0", {
    baudRate: 9600
  });
//Serial 1 Maneja motores

const parser1 = port1.pipe(new ReadLine1({ delimiter: '\r\n' }));

parser1.on('open', function () {
  console.log('connection is opened');
});

parser1.on('data', function (dataOriginal) {
  const data = dataOriginal.toString().split("*");
  console.log('recibo de port1', data);
  intervalFunc(data[0]);
});

parser1.on('error', (err) => console.log(err));
port1.on('error', (err) => console.log(err));

//Serial 2 Maneja sensores

// const parser2 = port1.pipe(new ReadLine2({ delimiter: '\r\n' }));

port2.on('open', function () {
  console.log('connection is opened');
});

port2.on('data', function (dataOriginal) {
  const data = dataOriginal.toString().split("*");
  console.log('recibo de port2', data);
  intervalFunc(data[0]);
  //io.emit('data', data);
});

// parser2.on('error', (err) => console.log(err));
port2.on('error', (err) => console.log(err));

//Calcula la ecuación v2
function v2(p1, p2, a1, a2){
// console.log("a1",a1);
// console.log("a2",a2);
// console.log("p1",p1);
// console.log("p2",p2);
  let val1 =(2*(p2 - p1));
  if  (val1 < 0){
    val1 = val1*(-1);
  }
  // const val2 = (1.28 *(1 - Math.pow(a2/a1, 2)))
  const val2 =1.176436938;
  const val3 = Math.sqrt( val1 / val2);
  return val3;
}

//Genera la data de prueba del arduino
setInterval(dataArduino, 1000);
function dataArduino(){
  count++;
  let serial;
  if (Math.random()*100>95) {
    serial ='r2:Error en el envío de datos!'
  }else{
    serial ='r1:'+(Math.random()*10).toFixed(2)+":"+(Math.random()*10).toFixed(2)+":"+(Math.random()*10).toFixed(2);
  }
  // console.log("serial del arduino prueba" ,serial);
  intervalFunc(serial);
}

var interNum;

// Función que recibe los datos del arduino y realiza los calculos
function intervalFunc(serial) {
  var dataArray = serial.split(":");
  //Distingue el tipo de mensaje o si la data llego corrupta
  if (dataArray[0] === "r2"){
    io.emit("alert", {message: dataArray[1]});

    const arrayArduino = volumen.toString() + ":" + IE.toString() + ":" + BPM.toString() + ":" + presion.toString() + ":" + th.toString() + ":" + modo.toString() + ":" + star.toString() + ":" + stop.toString();
    //console.log("La data para el arduino es: ", arrayArduino);
    //Envia la data por el puerto al arduino
    port1.write(arrayArduino);
 
  }else if (dataArray[0] === "r1"){


  const rawp1 =(parseFloat(dataArray[1])*dat1por)+(dat1mas);
  const rawp2 =(parseFloat(dataArray[2])*dat2por)+(dat2mas);

    const p1 = (rawp1)*98.06;
    const p2 = (rawp2)*98.06;

    // const p1 = parseFloat(dataArray[1])*98.06;
    // const p2 = parseFloat(dataArray[2])*98.06;

    // pre1=dataArray[1];
    pre1=rawp1;
    pre2=p2;

    // const peep = parseFloat(dataArray[3]);
    const a2 = Math.PI * Math.pow(0.004, 2);
    const a1 = Math.PI * Math.pow(0.0075, 2);

    const T = 60/BPM;
    const Tin = (T*IE)/(1+IE);
    const q = v2(p1, p2, a1, a2) * a2;
    const vol = q / Tin;

    // console.log("Datos de formula: p1",p1,"\np2", p2,"\na1", a1,"\na2", a2,"\nT", T,"\nTin", Tin,"\nvol", vol,"\npeep", peep);
    // console.log("Variables globales: modo", modo,"\nIE", IE,"\nvolumen", volumen,"\npresion", presion,"\nstar", star,"\nstop", stop,"\nq", q,"\nBPM",BPM);

    //Data que se enviará al frontend, tanto grafica como formulario
    //q es flujo - p1 es presion y vol es volumen
    data={
      second:count,
      data1:q*1000,
      data2:p1*0.0102,
      data3:vol*1000,
      BPM: BPM,
      //IE: IEtemp,
      IE1: IE1,
      IE2: IE2,
      volumen: volumen,
      presion: presion,
      th: th,
      modo: modo,
      peep: peep,
      a1c1: dat1por,
      a1c2: dat2por,
      a2c1: dat1mas,
      a2c2: dat2mas,
      valor_a1: dataArray[1],
      valor_a2: dataArray[2]
    }
    //console.log(data);
    io.emit('data', data);
  }
  else if (dataArray[0] === "r3"){

  //  peep = parseFloat(dataArray[1]);
  peep = pre1;
 
  }
  else{
    //Que debe hacer cuando la data es erronea?
    // console.log('Dato no valido');
  }
  
}

io.on('connection', (socket) => {
  console.log('socket connection opened:', socket.id);

  //Este socket espera por el aviso de parada
  //Una vez recibido debe enviarse al arduino
  socket.on('stop', function(data) {
    console.log("Stop value: ",data.stop);
    stop = data.stop;
    star = 0;
    clearInterval(interNum);
    let d1 =0;
    let d2 =0;
    let d3 =0;
    let d4 =100;
    let d5 =0;
    let d6 =0;
    let d7 =0;
    let d8 =0;
    try {
       d1 = volumen.toString();
    } catch (error) {
      
    }
    try {
      d2 = IE.toString();
    } catch (error) {
      
    }
   
   try {
    d3 = BPM.toString();
   } catch (error) {
     
   }
    try {
      d4 = 100;
    } catch (error) {
      
    }
    try {
      d5 = th.toString();
    } catch (error) {
      
    }
 
    try {
      d6 = modo.toString();
    } catch (error) {
      
    }
    try {
      d7 = star.toString();
    } catch (error) {
      
    }
    try {
      d8 = stop.toString();
    } catch (error) {
      
    }
    //Aqui se guarda el string que va a enviarse para el arduino
    const arrayArduino = d1+":"+d2+":"+d3+":"+d4+":"+d5+":"+d6+":"+d7+":"+d8;
    //Envia la data por el puerto al arduino´
    console.log("data detener ",arrayArduino)
    port1.write(arrayArduino);
    port2.write(arrayArduino);
  });


  //Este socket espera por la data del formulario
  socket.on('btS:press', function(data) {
    console.log(data);
    //asigna la data a las variables globales
    BPM = data.BPM;
    IE = data.IE1/data.IE2;
    IE1 = data.IE1;
    IE2 = data.IE2;
    //IEtemp = data.IE;
    //IE = 1/data.IE;
    volumen = data.Volumen;
    presion = data.Presion;
    th = data.Th;
    modo = data.modo;
    stop = 0;
    star = 1;

    // interNum = setInterval(randomNum, 1000);

    //Aqui se guarda el string que va a enviarse para el arduino
    const arrayArduino = volumen.toString() + ":" + IE.toString() + ":" + BPM.toString() + ":" + presion.toString() + ":" + th.toString() + ":" + modo.toString() + ":" + star.toString() + ":" + stop.toString();
    // console.log("La data para el arduino es: ", arrayArduino);
    //Envia la data por el puerto al arduino
    port1.write(arrayArduino);
    port2.write(arrayArduino);

    // console.log("Global data: ", modo, BPM, IE, volumen, presion, th, modo, star, stop);

    var nextPage = "grafica-a.html";
    //modo: 0 para asistido y 1 para volumen
    if (modo == 1){
      nextPage = "grafica-v.html";
    }
    
    //emite a main2 para que redirecione
    io.sockets.emit("redirect", nextPage);
  });

  socket.on('btnSD:press', function(data) {
    //exec
    console.log('Cayo en apagar', data);
    //Aqui se guarda el string que va a enviarse para el arduino
    const arrayArduino = volumen.toString() + ":" + IE.toString() + ":" + BPM.toString() + ":" + presion.toString() + ":" + th.toString() + ":" + modo.toString() + ":" + star.toString() + ":" + stop.toString();
    console.log("La data para el arduino es: ", arrayArduino);
    //Envia la data por el puerto al arduino para que se detenga
    port1.write(arrayArduino);
    port2.write(arrayArduino);
    exec('shutdown -h now', function(err, stdout, stderr){ callback(stdout) });
  });

  //Validar campos numericos
  const validar = (values) => {
    for (let i = 0;i<values.length;i++){
      //console.log('Llamo validar');
      if(isNaN(values[i])){
        return false;
      }
    }
    //console.log('Todo bien, dio True');
    return true;
  }

  //Este socket escribe los datos en el JSON
  socket.on('btAjustes:press', function(data) {
    console.log('Mod JSON', data);
    dat1por = data.a1c1;
    dat2por = data.a1c2;
    dat1mas = data.a2c1;
    dat2mas = data.a2c2;

    let aux = {
      a1c1: data.a1c1,
      a1c2: data.a1c2,
      a2c1: data.a2c1,
      a2c2: data.a2c2
    }
    let save = JSON.stringify(aux);
    console.log("dat1por",dat1por)
    if(validar(dat1por, dat2por, dat1mas, dat1mas)){
      try {
        jsonRead.writeFileSync('./public/json/calibracion.json', save);
      } catch (err) {
        io.sockets.emit("loginVal", false);
      }
    }else{
      io.sockets.emit("loginVal", false);
    }

  });
  //Valida la contraseña recibida
  socket.on('btLogin:press', function(data) {
    console.log('Login de autenticación', data);
    let usuario = data.user;
    let password = data.pass;
    console.log(usuario, password, user, pass);
    if(usuario == user && password == pass){
      io.sockets.emit("login", true);
    }else{
      io.sockets.emit("login", false);
    }
  });

  //Recibe y analiza los datos de calibración de A1
  socket.on('btCal_a1:press', function(data) {
    console.log('Data de calibración a1', data);
    let dataX = [data.x0,data.x1,data.x2,data.x3,data.x4];
    
    const sumX = dataX[0] + dataX[1] + dataX[2] + dataX[3] + dataX[4];
    const sumY = 0 + 10 + 20 + 30 + 40; 
    const sumXY = 0*dataX[0] + 10*dataX[1] + 20*dataX[2] + 30*dataX[3] + 40*dataX[4];
    const sumCuaX = Math.pow(dataX[0],2) + Math.pow(dataX[1],2) + Math.pow(dataX[2],2) + Math.pow(dataX[3],2) + Math.pow(dataX[4],2);
    m_a1 = (5*sumXY - sumX * sumY) / (5*sumCuaX - Math.abs(sumCuaX));
    b_a1 = (sumY*sumCuaX - sumX*sumXY)/(5*sumCuaX - Math.abs(sumCuaX));
    console.log('m =',m_a1,'b =',b_a1);
    let aux = {
      m_a1: m_a1,
      b_a1: b_a1,
      m_a2: m_a2,
      b_a2: b_a2
    }
    let save = JSON.stringify(aux);

    try{
      jsonRead.writeFileSync('./public/json/valores_min_cua.json', save);
    }catch(err){

    }
  });

    //Recibe y analiza los datos de calibración de A2
    socket.on('btCal_a2:press', function(data) {
      console.log('Data de calibración a2', data);
      let dataX = [data.x0,data.x1,data.x2,data.x3,data.x4];
      
      const sumX = dataX[0] + dataX[1] + dataX[2] + dataX[3] + dataX[4];
      const sumY = 0 + 10 + 20 + 30 + 40; 
      const sumXY = 0*dataX[0] + 10*dataX[1] + 20*dataX[2] + 30*dataX[3] + 40*dataX[4];
      const sumCuaX = Math.pow(dataX[0],2) + Math.pow(dataX[1],2) + Math.pow(dataX[2],2) + Math.pow(dataX[3],2) + Math.pow(dataX[4],2);
      m_a2 = (5*sumXY - sumX * sumY) / (5*sumCuaX - Math.abs(sumCuaX));
      b_a2 = (sumY*sumCuaX - sumX*sumXY)/(5*sumCuaX - Math.abs(sumCuaX));
      console.log('m =',m_a2,'b =',b_a2);
      let aux = {
        m_a1: m_a1,
        b_a1: b_a1,
        m_a2: m_a2,
        b_a2: b_a2
      }
      let save = JSON.stringify(aux);
  
      try{
        jsonRead.writeFileSync('./public/json/valores_min_cua.json', save);
      }catch(err){
  
      }
    });

});
