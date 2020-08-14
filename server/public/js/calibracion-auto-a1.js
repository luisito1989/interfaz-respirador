const socket = io('http://localhost:3000');
let loaded = false;
//Formulario
const btnS = document.getElementById('sendCal');
const btnC = document.getElementById('captData');

let valoresCal = ['N/A','N/A','N/A','N/A','N/A'];
let campo = 0;

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

  socket.on("redirect", function(nextPage){
    window.location.href = nextPage;
  })
  
  btnS.addEventListener('click', function(e) {
    console.log('enviar',valoresCal);
    if (validar(valoresCal)){
      console.log('result true');
        socket.emit('btCal_a1:press', {
          x0: parseFloat(valoresCal[0]),
          x1: parseFloat(valoresCal[1]),
          x2: parseFloat(valoresCal[2]),
          x3: parseFloat(valoresCal[3]),
          x4: parseFloat(valoresCal[4])
        });
        $('#modalHeaderText').html('Datos enviados');
        $('#modalBodyText').html('Los campos han sido enviados');
        $('#exampleModal').modal();
        e.preventDefault();
    }else{
        console.log('result false');
        $('#modalHeaderText').html('Error');
        $('#modalBodyText').html('La calibración no pudo ser completada');
        $('#exampleModal').modal();
        e.preventDefault();
    }
  });

  btnC.addEventListener('click', function(e) {
    console.log('Capturado', campo);
    valoresCal[campo] = document.getElementById("valorX").text;
    document.getElementById("X0").innerHTML = valoresCal[0];
    document.getElementById("X1").innerHTML = valoresCal[1];
    document.getElementById("X2").innerHTML = valoresCal[2];
    document.getElementById("X3").innerHTML = valoresCal[3];
    document.getElementById("X4").innerHTML = valoresCal[4];
    campo++;
    console.log(valoresCal);
    e.preventDefault();
  });

  //Este socket recibe la información del server
  socket.on("data", function (data) {
    console.log('Cargar data!!!!!!!', data.valor_a1);
    document.getElementById("valorX").innerHTML = data.valor_a1;
  });

  //Este socket recibe la información del server
  socket.on("loginVal", function (val) {
      if(val == false){
        $('#modalHeaderText').html('Error en envio de datos');
        $('#modalBodyText').html('Se produjo un error en los datos');
        $('#exampleModal').modal();
      }

  });
