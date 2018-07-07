console.log('Connecting...');
const ws = new WebSocket(`ws://` + location.host);
let heartbeat;
const FREQ = 15000;
const SIZE = {
  HEIGHT: 500,
  WIDTH: 960
};
const BAR = {
  WIDTH: 1
}

const ALL = 'all';
const ONE = 'one';
const _msg = (kind) => JSON.stringify({"req": kind})

const msgAll = _msg(ALL);
const msgOne = _msg(ONE);

let temperatureData = [];

ws.onopen = (e) => {
  // Initially, get everything.
  ws.send(msgAll);    

  // After that, get one reading at a time.
  // heartbeat = setInterval(() => {
    // ws.send(msgOne);    
  // }, FREQ);

  ws.onmessage = (e) => {
    try {
      const data = JSON.parse(e.data);
      console.log(data);

      temperatureData = [
        ...temperatureData,
        ...data.slice(0)
      ];

      // heartbeat = 500;
      // setInterval(() => {
      //   temperatureData = [
      //     ...temperatureData,
      //     ...data.slice(heartbeat, heartbeat + 100)
      //   ];
      //   render();
        
      // }, 100)
      
      // output.textContent = data.y;
      render();
    } catch (e) {
      // console.error(e);
    }
  }
}

// Based on https://bl.ocks.org/d3noob/402dd382a51a4f6eea487f9a35566de0

// Set the dimensions and the margins of the graph
const margin = {
  top: 20,
  right: 20,
  bottom: 30,
  left: 50
};

const width = SIZE.WIDTH - margin.left - margin.right;
const height = SIZE.HEIGHT - margin.top - margin.bottom;

// create the time parser for unix timestamps
const parseTime = d3.timeParse('%Q');

// set the ranges based on the size of the graph
const x = d3.scaleTime().range([0, width]);
const y = d3.scaleLinear().range([height, 0]);

// define the line in terms of my range functions (created above)
const valueLine = d3.line()
      .x(d => x(d.x))
      .y(d => y(d.y))

// appends the svg object to the page
// appends a group element to the svg object
// moves the group element to the top left margin
const svg = d3.select(`[data-output]`).append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.right})`)

const render = () => {

  // Format the data
  const data = temperatureData.map(d => ({
    x: parseTime(d.x),
    y: parseFloat(d.y)
  }));

  // Scale the range of the data
  x.domain(d3.extent(data, d => d.x));
  y.domain(d3.extent(data, d => d.y));

  // Add the valueLine path
  svg.append('path')
    .data([data])  
    .attr('class', 'line')
    .attr('d', valueLine)

  // Add the X Axis
  svg.append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(x))

  svg.append('g')
    .call(d3.axisLeft(y))
}
