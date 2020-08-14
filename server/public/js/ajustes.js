const socket = io('http://localhost:3000');
let loaded = false;
//Formulario
const btnS = document.getElementById('sendData');

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
    let a1c1 = parseFloat(document.getElementById('a1c1').value, 10);
    let a1c2 = parseFloat(document.getElementById('a1c2').value, 10);
    let a2c1 = parseFloat(document.getElementById('a2c1').value, 10);
    let a2c2 = parseFloat(document.getElementById('a2c2').value, 10);
    
    console.log([a1c1, a1c2, a2c1, a2c2]);
    if (validar([a1c1, a1c2, a2c1, a2c2])){
        socket.emit('btAjustes:press', {
          a1c1: a1c1, 
          a1c2: a1c2, 
          a2c1: a2c1, 
          a2c2: a2c2
        });
        $('#modalHeaderText').html('Datos enviados');
        $('#modalBodyText').html('Los campos han sido enviados');
        $('#exampleModal').modal();
        e.preventDefault();
    }else{
        $('#modalHeaderText').html('Error');
        $('#modalBodyText').html('Ningún campo puede estar vacío y deben ser números');
        $('#exampleModal').modal();
        e.preventDefault();
    }
  });

  //Este socket recibe la información del server
  socket.on("data", function (data) {
    if(loaded == false){
      console.log('Cargar data!!!!!!!');
      document.getElementById("a1c1").value = data.a1c1;
      document.getElementById("a1c2").value = data.a1c2;
      document.getElementById("a2c1").value = data.a2c1;
      document.getElementById("a2c2").value = data.a2c2;
      loaded = true;
    }
  });

  //Este socket recibe la información del server
  socket.on("loginVal", function (val) {
      if(val == false){
        $('#modalHeaderText').html('Error en envio de datos');
        $('#modalBodyText').html('Se produjo un error en los datos');
        $('#exampleModal').modal();
      }

  });
