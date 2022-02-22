const express = require('express')
const WebSocket = require('ws');
const net = require('net');

function expressServer() {

  const PORT = process.env.PORT || 3000;
  const INDEX = '/index.html';
  
  const server = express()
    .use(express.static(__dirname), (req, res) => res.sendFile(INDEX, { root: __dirname }))
    .listen(PORT, () => console.log(`Listening on ${PORT}`))
  
  console.log('Express server started.');
  
  serverWS(server)
}

expressServer()

function serverWS(server) {
  const wsServer = new WebSocket.Server({ server });

  console.log('Websocket server started.');

  wsServer.on('connection', function(wsClient) {
    console.log('Websocket sending temporary response.');
    wsClient.send("\"Refreshing server status, Agent..\"");

    wsClient.on('message', function(request) {
      console.log('Websocket server received request.');
      if (request == "official") {
        clientOfficialTCP().then(online => {
          wsClient.send(online)
        }).catch(offline => {
          wsClient.send(offline)
        });
      }
    });
  });
}

function clientOfficialTCP() {
  return new Promise((resolve, reject) => {
    const client = new net.Socket();

    const request = Buffer.from([0x0a, 0x00, 0x3b, 0x00, 0x01, 0x00, 0x36, 0x05, 0x01, 0x00, 0x05, 0x01])
    const required = Buffer.from([0x1c, 0x00, 0x3b, 0x00, 0x02, 0x00, 0x36, 0x05, 0x01, 0x00, 0x05, 0x01, 0x73, 0x04])

    client.connect(9000, '107.150.130.77', function() {
      console.log('TCP client connected, sending request.');
      client.write(request)
    });

    client.on('data', function(response) {
      console.log('TCP client received response.');

      if (Buffer.from(response).includes(required)) {
        resolve("\"Refreshed, the official server is online, Agent.\"")
      } else {
        reject("\"Refreshed, the official server is offline, Agent.\"")
      }
    });

    client.setTimeout(1000);

    client.on('timeout', () => {
      console.log('TCP client timeout.');
      reject("\"Refreshed, the official server is offline, Agent.\"")
    });

    client.on('error', function() {
      console.log('TCP client error.');
      reject("\"Refreshed, the official server is offline, Agent.\"")
    });

  });
}