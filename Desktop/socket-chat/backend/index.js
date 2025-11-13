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

// DOZVOLJENI FRONTEND DOMENI
const allowedOrigins = [
  'http://localhost:5173', // lokalni frontend
  'https://socket-chat-9ibl-b0t3hlfd1-aleksandras-projects-79a46c16.vercel.app', // Vercel frontend
  'https://socket-chat-9ibl.vercel.app', // kratki Vercel URL
];

// Middleware za REST API CORS
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log('Blocked REST API by CORS:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

const server = http.createServer(app);

// Socket.IO sa istim allowedOrigins
const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log('Blocked Socket.IO by CORS:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Socket logika
chatSocket(io);

// REST API rute
app.use('/api/messages', messageRoute);
app.use('/api/users', (req, res, next) => {
  const origin = req.headers.origin;
  if (!origin || allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
  } else {
    res.status(403).send('Not allowed by CORS');
  }
}, userRoute);

// Pokretanje servera
const PORT = process.env.PORT || 8100;
server.listen(PORT, () =>
  console.log(`Server je pokrenut na portu ${PORT}`)
);
