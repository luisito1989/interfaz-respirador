const socket = io('http://localhost:3000');
let loaded = false;
//Formulario
const btnS = document.getElementById('sendData');
let modo = document.getElementById('titulo').innerHTML === "Control Asistido"?0:1;// indica el modo de trabajo (0 - asistido / 1 - volumen)
console.log("llamando load 2");


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
    let BPM = parseFloat(document.getElementById('bpm').value, 10);
    let IE1 = parseFloat(document.getElementById('ie1').value, 10);
    let IE2 = parseFloat(document.getElementById('ie2').value, 10);
    // let IE = parseFloat(document.getElementById('IEratio').value, 10);
    let IE = IE1/IE2;
    let Volumen = parseFloat(document.getElementById('volumen').value, 10);
    let Presion = parseFloat(document.getElementById('presion').value, 10);
    let Th = parseFloat(document.getElementById('th').value, 10);
    let titulo = document.getElementById('titulo').innerHTML;
    
    console.log([BPM, IE1, IE2, Volumen, Presion, Th]);
    if (validar([BPM, IE1, IE2, Volumen, Presion, Th])){
    // console.log([BPM, IE, Volumen, Presion, Th]);
    // if (validar([BPM, IE, Volumen, Presion, Th])){
      if (45 < BPM || BPM < 12){
        $('#modalHeaderText').html('Error de rango');
        $('#modalBodyText').html('El BPM debe estar entre 12 y 45');
        $('#exampleModal').modal();
        e.preventDefault();
      }else if (800 < Volumen || Volumen < 200) {
        $('#modalHeaderText').html('Error');
        $('#modalBodyText').html('El volumen debe estar entre 200 y 800 ml');
        $('#exampleModal').modal();
        e.preventDefault();
      }else if (40 < Presion || Presion < 0){
        $('#modalHeaderText').html('Error de rango');
        $('#modalBodyText').html('El valor de presión debe estar entre 0 y 40');
        $('#exampleModal').modal();
        e.preventDefault();
      }else if (1 < Th || Th < 0.2) {
        $('#modalHeaderText').html('Error de rango');
        $('#modalBodyText').html('El tiempo de pausa debe estar entre 0.2 y 1');
        $('#exampleModal').modal();
        e.preventDefault();
      }else if (IE1 < 1){
        $('#modalHeaderText').html('Error de rango');
        $('#modalBodyText').html('El valor de inhalar no puede ser 0');
        $('#exampleModal').modal();
        e.preventDefault();
      }else if (IE2 < 1){
        $('#modalHeaderText').html('Error en rango');
        $('#modalBodyText').html('El valor de exalar no puede ser 0');
        $('#exampleModal').modal();
        e.preventDefault();
      }else if (IE < 0.2 || IE > 1){
        $('#modalHeaderText').html('Error en rango');
        $('#modalBodyText').html('El ratio de I/E debe estar entre 0.2 y 1');
        $('#exampleModal').modal();
        e.preventDefault();
      }else{
        socket.emit('btS:press', {
          BPM: BPM,
          IE1: IE1,
          IE2: IE2,
          IE: IE,
          Volumen: Volumen,
          Presion: Presion,
          Th: Th,
          modo: modo
        });
      }
    }else{
        $('#modalHeaderText').html('Error');
        $('#modalBodyText').html('Ningún campo puede estar vacío');
        $('#exampleModal').modal();
        e.preventDefault();
    }
    
  });

    //Este socket recibe la información del server
    socket.on("data", function (data) {
      console.log(data.modo);
      if(data.modo == modo && loaded == false){
        console.log('Cargar data!!!!!!!');
        document.getElementById("bpm").value = data.BPM;
        document.getElementById("ie1").value = data.IE1;
        document.getElementById("ie2").value = data.IE2;
        //document.getElementById("IEratio").value = data.IE;
        document.getElementById("volumen").value = data.volumen;
        document.getElementById("presion").value = data.presion;
        document.getElementById("th").value = data.th;
        loaded = true;
      }
    });
