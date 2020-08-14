const socket = io('http://localhost:3000');
const btnStop = document.getElementById('stop');

const btnModalStop = document.getElementById('modalStop');

btnStop.addEventListener('click', function (e) {
  console.log('Llamo al boton');
    $('#modalHeaderText').html('Aviso de parada');
    $('#modalBodyText').html('El sistema se a detenido');
    $('#exampleModal').modal();
    e.preventDefault();
    socket.emit('stop', {
      stop: 1
    });
  });

btnModalStop.addEventListener('click', function (e) {
  console.log('Llamo al boton');
    $('#modalHeaderText').html('Aviso de parada');
    $('#modalBodyText').html('El sistema se a detenido');
    $('#exampleModal').modal();
    e.preventDefault();
    socket.emit('stop', {
      stop: 1
    });
  });