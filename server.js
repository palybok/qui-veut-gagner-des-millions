const express = require('express');
const axios = require('axios');
const http = require('http');
const cors = require('cors');

const { Server } = require('socket.io');

const app = express();
app.use(express.json());
app.use(cors());

// Point de terminaison de proxy pour contourner les restrictions CORS
app.all('/proxy/*', (req, res) => {
    const targetURL = req.url.split('/proxy/')[1];
    axios({
        url: targetURL,
        method: req.method,
        data: req.body,
        headers: {
            ...req.headers,
            host: new URL(targetURL).host
        }
    })
    .then(response => {
        res.json(response.data);
    })
    .catch(error => {
        if (error.response) {
            // Forwarder la réponse d'erreur du serveur cible
            res.status(error.response.status).json(error.response.data);
        } else {
            // Réponse d'erreur générique pour les autres types d'erreurs
            res.status(500).json({ error: error.toString() });
        }
    });
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",  // permettre à toutes les origines d'accéder
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
    console.log('User connected');
    socket.on('update-data', (data) => {
        socket.broadcast.emit('data-updated', data);
    });
});

server.listen(3001, () => {
    console.log('WebSocket server listening on port 3001');
});
