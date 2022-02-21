const express = require('express')

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

const server = express()
  .use(express.static(__dirname), (req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`))
  
const net = require('net');

const client = new net.Socket();

const request = Buffer.from([0x0a, 0x00, 0x3b, 0x00, 0x01, 0x00, 0x36, 0x05, 0x01, 0x00, 0x05, 0x01])
const online = Buffer.from([0x1c, 0x00, 0x3b, 0x00, 0x02, 0x00, 0x36, 0x05, 0x01, 0x00, 0x05, 0x01, 0x73, 0x04])

client.connect(9000, '107.150.130.77', function() {
  client.write(request)
});

var status

client.on('data', function(response) {
  let buffer = Buffer.from(response);

  if (buffer.includes(online)) {
      status = "\"Refreshed, the official server is online, Agent.\""
  } else {
      status = "\"Refreshed, the official server is offline, Agent.\""
  }
});

const WebSocket = require('ws');
const wsServer = new WebSocket.Server({ server });

wsServer.on('connection', onConnect);

function onConnect(wsClient) {
  wsClient.send(status);
}