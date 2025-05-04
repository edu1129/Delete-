const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

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
    console.log(`[${new Date().toISOString()}] User connected: ${socket.id}`);
    
    socket.on('disconnect', (reason) => {
        console.log(`[${new Date().toISOString()}] User disconnected: ${socket.id}, Reason: ${reason}`);
    });
    
    socket.on('chat message', (msg) => {
        console.log(`[${new Date().toISOString()}] Message from ${socket.id}: ${msg}`);
        // Sanitize message if needed before broadcasting
        const sanitizedMsg = String(msg).trim(); // Basic trim, add more sanitization if required
        if (sanitizedMsg) {
            io.emit('chat message', sanitizedMsg); // Broadcast to all connected clients
        } else {
            console.log(`[${new Date().toISOString()}] Empty message received from ${socket.id}. Ignored.`);
        }
        
    });
    
    socket.on('error', (error) => {
        console.error(`[${new Date().toISOString()}] Socket Error from ${socket.id}:`, error);
    });
});

// Catch server errors
server.on('error', (error) => {
    console.error(`[${new Date().toISOString()}] Server Error:`, error);
});

module.exports = server;

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
        console.log(`[${new Date().toISOString()}] Development server listening locally on *:${PORT}`);
    });
}