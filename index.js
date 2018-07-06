
// Create an express app
const express = require('express');
const app = express();

// Create an HTTP server from the express app
const http = require('http');
const server = http.createServer(app);

// Connect a WebSocket server to the HTTP server
const WebSocket = require('ws');
const wss = new WebSocket.Server({server});

// Pull the port number from the env
const PORT = process.env.PORT || 3000;

const db = require('./db');

// Use express' static middleware to server the HTML
app.use(express.static('public'));

// For now, simply report connection and echo latest temp
wss.on('connection', ws => {
  ws.on('message', msg => {
    console.log(`received ${msg}`);
    db.selectTemperatures()
      .then(rows => {
        ws.send('you want stuffs?');
        ws.send(JSON.stringify(rows[0]));
      })
      .catch(console.log)
  });
  ws.send('ahoy there!');
});

// Start the server.
server.listen(PORT, () => {
  console.log(`All aboard! BBQWeb is running at http://localhost:${PORT}`);
})
