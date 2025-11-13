require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const messageRoute = require('./routes/messageRoute');
const userRoute = require('./routes/userRoute');
const chatSocket = require('./socket/chat');
const db = require('./db');

const app = express();
app.use(express.json());

app.use(
	cors({
		origin: 'https://aleksandra-socket.alwaysdata.net',
		credentials: true,
	})
);

const server = http.createServer(app);

const io = new Server(server, {
	cors: {
		origin: 'https://aleksandra-socket.alwaysdata.net',
		methods: ['GET', 'POST'],
	},
});

chatSocket(io);

app.use('/api/messages', messageRoute);
app.use('/api/users', userRoute);

const PORT = process.env.PORT || 8100;
server.listen(PORT, () =>
	console.log(`Server je pokrenut na ${PORT} `)
);
