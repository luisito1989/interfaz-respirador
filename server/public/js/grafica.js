const socket = io();

const field1 = document.getElementById("field1");
const field2 = document.getElementById("field2");
const field3 = document.getElementById("field3");
/*
var ctx1 = document.getElementById("data1").getContext("2d");

var chart1 = new Chart(ctx1, {
  // The type of chart we want to create
  type: "line",

  // The data for our dataset
  data: {
    labels: ["Serial"],
    datasets: [
      {
        label: "Data1",
        backgroundColor: "rgb(52, 73, 94, 0)",
        borderColor: "#08D9D6",
        data: [],
      },
    ],
  },

  // Configuration options go here
  options: {
    scales: {
      yAxes: [{
        ticks: {
          suggestedMax: 1000,
          stepSize: 100
        }
      }],
      xAxes: [{
        ticks: {
          display: false
        }
      }]
    },
    legend: {
      display: false
    },
    title: {
      display: false,
      text: "Titulo 1"
    }
  },
});
*/
var ctx2 = document.getElementById("data2").getContext("2d");

var chart2 = new Chart(ctx2, {
  // The type of chart we want to create
  type: "line",

  // The data for our dataset
  data: {
    labels: ["Serial"],
    datasets: [
      {
        label: "Data2",
        backgroundColor: "rgb(52, 73, 94, 0)",
        borderColor: "#252A34",
        data: [],
      },
    ],
  },

  // Configuration options go here
  options: {
    scales: {
      yAxes: [{
        ticks: {
          suggestedMax: 60,
          suggestedMin: 0,
          stepSize: 10
        }
      }],
      xAxes: [{
        ticks: {
          display: false
        }
      }]
    },
    legend: {
      display: false
    },
    title: {
      display: false,
      text: "Titulo 2"
    }
  },
});
/*
var ctx3 = document.getElementById("data3").getContext("2d");

var chart3 = new Chart(ctx3, {
  // The type of chart we want to create
  type: "line",

  // The data for our dataset
  data: {
    labels: ["Serial"],
    datasets: [
      {
        label: "Data3",
        backgroundColor: "rgb(52, 73, 94, 0)",
        borderColor: "#FF2E63",
        data: [],
      },
    ],
  },

  // Configuration options go here
  options: {
    scales: {
      yAxes: [{
        ticks: {
          suggestedMax: 1000,
          suggestedMin: 0,
          stepSize: 100
        }
      }],
      xAxes: [{
        ticks: {
          display: false
        }
      }]
    },
    legend: {
      display: false
    },
    title: {
      display: false,
      text: "Titulo 3"
    }
  },
});
*/
// let counter = 0 ;
//Este socket recibe la información del server
socket.on("data", function (data) {
//  setChart(chart1, data.data1.toFixed(2), data.second, field1);
  setChart(chart2, data.data2.toFixed(2), data.second, field2);
//  setChart(chart3, data.data3.toFixed(2), data.second, field3);
  document.getElementById("campo1").innerHTML = data.BPM;
  document.getElementById("campo2").innerHTML = data.IE1 + "/" + data.IE2;
  document.getElementById("campo3").innerHTML = data.volumen;
  document.getElementById("campo4").innerHTML = data.presion;
  document.getElementById("campo5").innerHTML = data.th;
  document.getElementById("peep").innerHTML = data.peep;
});

const setChart = (chart, data, second, field) => {

  console.log(chart.data.labels)
  const length = 20

  if (chart.data.labels.length > length) {
    chart.data.labels.shift();
    chart.data.labels.push(second);
  } else {
    chart.data.labels.push(second);
  }

  // chart.data.labels.push(second);
  chart.data.datasets.forEach((dataset) => {
    console.log(dataset.data)
    if (dataset.data.length > length) {
      dataset.data.shift();
      dataset.data.push(data);
    } else {
      dataset.data.push(data);
    }
  });
  field.innerHTML = `${data}`;
  chart.update();
};
