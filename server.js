const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
  path: '/socket.io/'
});

io.on('connection', (socket) => {
  socket.on('disconnect', () => {});
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});

const serveFile = (res, filePath, contentType) => {
  fs.readFile(path.join(__dirname, filePath), (err, data) => {
    if (err) {
      res.writeHead(500);
      res.end('Server Error');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
};

const requestHandler = (req, res) => {
  const url = req.url;
  
  if (url.startsWith('/socket.io/')) {
    // Socket.IO engine handles these requests automatically via the server object
    // We don't need to explicitly call handleRequest here when integrated with http server
    // Ensure the main handler doesn't interfere
    return;
  }
  
  switch (url) {
    case '/':
      serveFile(res, 'index.html', 'text/html');
      break;
    case '/style.css':
      serveFile(res, 'style.css', 'text/css');
      break;
    case '/client.js':
      serveFile(res, 'client.js', 'application/javascript');
      break;
    default:
      res.writeHead(404);
      res.end('Not Found');
  }
};

app.all('/*', requestHandler);


// Vercel will use the exported handler
module.exports = (req, res) => {
  if (req.url.startsWith('/socket.io/')) {
    io.engine.handleRequest(req, res);
    return;
  }
  requestHandler(req, res);
};


// Local development listener
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Server listening locally on *:${PORT}`);
  });
}