const socket = io('http://localhost:3000');
const shotdown = document.getElementById('shutdown');

shotdown.addEventListener('click', () => {
    console.log('Apagar');
    socket.emit('btnSD:press', true);
});
