const express = require('express')
    , http = require('http')
    , path = require('path')
    , socketio = require('socket.io');


const app = express();
const server = http.createServer(app);
const io = socketio(server);

server.listen(3000);

app.use(express.static(path.join(__dirname, 'public')));

/* Config */
const validToken = 'DZ';

/* Functions */
const isValidToken = (token) => token === validToken;

/* Middlewares */

io.use((socket, next) => {

    const {request} = socket;
    const {query} = socket.handshake;

    const headers = request.headers;

    console.log(`Headers:`, headers);
    console.log(`Query:`, query);

    if (!isValidToken(query.token)) {
        return next(new Error('invalid_token'));
    }

    return next();
});

/* Origins */

io.origins((origin, callback) => {

    console.log(`Origin: ${origin}`);

    // return callback('origin not allowed', false);


    return callback(null, true);
});

/* Socket */

io.on('connection', (socket) => {

    console.log(`User connected: ${socket.id}`);

    socket.on('disconnect', (dis) => {
        console.log(`User disconnected: ${dis}`)
    });

    setInterval(() => {
        socket.emit('message', 'new message');
    }, 1000);
});
