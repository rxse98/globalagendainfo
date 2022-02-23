// include libs
const express = require('express')
const WebSocket = require('ws');
const net = require('net');

// creates server to host site
function expressServer() {

  // express server port
  const PORT = process.env.PORT || 3000;
  
  // index.html was sent, all files in directory root should be loaded, start express server
  const server = express()
    .use(express.static(__dirname), (req, res) => res.sendFile('/index.html', { root: __dirname }))
    .listen(PORT, () => console.log(`Listening on ${PORT}`))
  
  console.log('Express server started.');
  
  serverWS(server)
}

expressServer()

// ws server sends and receives data from tcp client, then returns data back to ws client
function serverWS(server) {

  // create ws server, all opts are the same as express server
  const wsServer = new WebSocket.Server({ server });

  // ws server reacts on ws client
  wsServer.on('connection', function(wsClient) {

    // ws server receives request from ws client
    wsClient.on('message', function(request) {
      console.log('Websocket server received request.');

      // ws server receives request from ws client to refresh GA server status
      if (request == "official") {
        // ws server sends temporary data to ws client
        console.log('Websocket sending temporary response.');
        wsClient.send("\"Refreshing server status, Agent..\"");
        // ws server creates tcp client and waits for response, then ws server sends GA server status to ws client
        clientOfficialTCP().then(online => {
          wsClient.send(online)
        }).catch(offline => {
          wsClient.send(offline)
        });
      }
    });
  });
}

// tcp client sends data to GA server and promises that response will return to ws server as tcp client receives it
function clientOfficialTCP() {
  return new Promise((resolve, reject) => {

    // create tcp client
    const client = new net.Socket();

    // tcp client request to check GA server status
    const request = Buffer.from([0x0a, 0x00, 0x3b, 0x00, 0x01, 0x00, 0x36, 0x05, 0x01, 0x00, 0x05, 0x01])

    // GA server is online if tcp client receives required response
    const required = Buffer.from([0x1c, 0x00, 0x3b, 0x00, 0x02, 0x00, 0x36, 0x05, 0x01, 0x00, 0x05, 0x01, 0x73, 0x04])

    // tcp client sends request to GA server
    client.connect(9000, '107.150.130.77', function() {
      console.log('TCP client sending request.');
      client.write(request)
    });

    // tcp client receives response from GA server
    client.on('data', function(response) {
      console.log('TCP client received response.');

      // tcp client checks response of GA server and sends it to ws server
      if (Buffer.from(response).includes(required)) {
        resolve("\"Refreshed, the official server is online, Agent.\"")
      } else {
        reject("\"Refreshed, the official server is offline, Agent.\"")
      }
    });

    // tcp client connection timeout
    client.setTimeout(5000);

    // tcp client sends response to ws server after timeout, GA server is offline or user's internet connection is low
    client.on('timeout', () => {
      console.log('TCP client timeout.');
      reject("\"Refreshed, the official server is offline, Agent.\"")
    });

    // tcp client connection error, can't reach GA server
    client.on('error', function() {
      console.log('TCP client error.');
      reject("\"Refreshed, the official server is offline, Agent.\"")
    });

  });
}