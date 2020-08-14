const margin = 60;
const height = 400 - 2 * margin;
const width = 600 - 2 * margin;

const svg = d3.select('#svg-wrapper');

const chart = svg.append('g').attr('transform', `translate(${margin}, ${margin}})`);

//Aqui indico el rango del eje y
const yScale = d3.scaleLinear().range([height, 0]).domain([0, 100]);

chart.append('g').call(d3.axisLeft(yScale));

//Aqui indico el rango del eje x
const xScale = d3.ScaleBand().range([0, width]).domain(sample.map((s) => s.language)).padding(0.2);

chart.append('g').attr('transform', `translate(0, ${height})`).call(d3.axisBottom(xScale));
