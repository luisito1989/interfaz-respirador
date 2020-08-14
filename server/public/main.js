const socket = io();

const field = document.getElementById('field');
let btn1 = document.getElementById('button1');
let btn2 = document.getElementById('button2');
let message = document.getElementById('message');
let output = document.getElementById('output');
let actions = document.getElementById('actions');
let root = document.getElementById('root');

console.log("llamando load")
socket.emit('load', {
  message: "cargando",
});


btn1.addEventListener('click', function() {
  socket.emit('bt1:press', {
    message: message.value,
  });
});

btn2.addEventListener('click', function() {
  socket.emit('bt2:press', {
    message: message.value,
  });
});

socket.on('data', function (data) {
  console.log(data);
  field.innerHTML = `${data}`;
});


socket.on('response', function (data) {
  console.log("response data",data)
  actions.innerHTML = '';
  output.innerHTML += `<p>
    <strong>${data.button}</strong>: ${data.message}
  </p>`
});