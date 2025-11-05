require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const db = require('./db');
const app = express();
const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
	console.log('A user connected: ', socket.id);

	socket.on('chatMessage', (msg) => {
		console.log('Message received: ', msg);
		io.emit('chatMessage', msg);
	});

	socket.on('disconnect', () => {
		console.log('User disconnect: ', socket.id);
	});
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () =>
	console.log(`Server je pokrenut na ${PORT} `)
);
