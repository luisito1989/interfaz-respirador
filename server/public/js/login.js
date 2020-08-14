const socket = io('http://localhost:3000');
const btnL = document.getElementById('modalAjuste');

btnL.addEventListener('click', (e) => {
    let user = document.getElementById('user').value;
    let pass = document.getElementById('pass').value;
    console.log(user, pass);
    socket.emit('btLogin:press', {user: user, pass: pass});

    socket.on("login", function(value){
        if(value == true){
          window.location.href = "ajustes-manual.html";
        }else{
            $('#exampleModal2').modal();
        }
      });
    e.preventDefault();
});
