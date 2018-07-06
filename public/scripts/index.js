console.log('Connecting...');

const ws = new WebSocket(`ws://` + location.host);

ws.onopen = (e) => {
  ws.send('hey');

  ws.onmessage = (e) => {
    console.log(e.data);
  }
}
