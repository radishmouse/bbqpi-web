console.log('Connecting...');
const ws = new WebSocket(`ws://` + location.host);

const output = document.querySelector(`[data-output]`);
let heartbeat;

const FREQ = 15000;

ws.onopen = (e) => {
  ws.send('hey');    

  heartbeat = setInterval(() => {
    ws.send('hey');    
  }, FREQ);

  ws.onmessage = (e) => {
    try {
      const data = JSON.parse(e.data);
      console.log(data.y);
      output.textContent = data.y;
    } catch (e) {
      // console.error(e);
    }
  }
}
