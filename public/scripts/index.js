console.log('Connecting...');
const ws = new WebSocket(`ws://` + location.host);
let heartbeat;
const FREQ = 15000;


const graph = document.querySelector(`[data-output]`);
const svg = d3.select(`[data-output]`);

svg.append('svg')
  .attr('height', 500)
  .attr('width', 500)

const ALL = 'all';
const ONE = 'one';
const _msg = (kind) => JSON.stringify({"req": kind})

const msgAll = _msg(ALL);
const msgOne = _msg(ONE);

ws.onopen = (e) => {

  // Initially, get everything.
  ws.send(msgAll);    

  // After that, get one reading at a time.
  heartbeat = setInterval(() => {
    ws.send(msgOne);    
  }, FREQ);

  ws.onmessage = (e) => {
    try {
      const data = JSON.parse(e.data);
      console.log(data);
      // output.textContent = data.y;
    } catch (e) {
      // console.error(e);
    }
  }
}
