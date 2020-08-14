const socket = io();

socket.on("alert", function (data) {
    const message = data.message;
      $('#modalHeaderText').html('ALERTA');
      $('#modalBodyText').html(message);
      $('#exampleModal').modal();
  });
