console.log('Connecting...');
const ws = new WebSocket(`ws://` + location.host);
let heartbeat;
const FREQ = 15000;
const SIZE = 500;
const BAR = {
  WIDTH: 1
}

const ALL = 'all';
const ONE = 'one';
const _msg = (kind) => JSON.stringify({"req": kind})

const msgAll = _msg(ALL);
const msgOne = _msg(ONE);

let temperatureData = [];

// const graph = document.querySelector(`[data-output]`);
const svg = d3.select(`[data-output]`);

const stage = svg.append('svg')
  .attr('height', SIZE)
  .attr('width', SIZE * 2)
  .style('background', 'orange')
  .append('g')



const render = () => {
  // console.log('doing and working and doing');
  let x = d3.scaleTime();
  x.domain(d3.extent(temperatureData, d => new Date(d.x)));
  x.range(d3.extent(temperatureData, d => d.y));

  // let xAxis = d3.axisBottom(x).ticks(temperatureData.length)
  
  // svg.append('g').call(xAxis);

  let rects = stage.selectAll(`rect`).data(temperatureData);

  rects.enter().append(`rect`)
    .attr('width', BAR.WIDTH)
    .attr('x', (d, i) => i * BAR.WIDTH * 2)
    .attr('y', d => SIZE - d.y)
    .attr('height', d => d.y)
    .style('background', 'red')

  // rects.transition()
    // .duration(0)
      // .attr('x', (d, i) => i * 6)
      // .attr('y', d => 100 - d.y)
      // .attr('height', d => d.y)

  // rects.exit().remove();
}

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

      console.log('hay');
      // output.textContent = data.y;
      render();
    } catch (e) {
      // console.error(e);
    }
  }
}
