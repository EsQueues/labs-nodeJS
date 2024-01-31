// Required modules
const fs = require('fs');
const express = require('express');
const EventEmitter = require('events');

// Create an EventEmitter instance for chat messages
const chatEmitter = new EventEmitter();
chatEmitter.on('message', console.log);

// Set up port and create an Express app
const port = process.env.PORT || 1337;
const app = express();

// Define routes and their corresponding handlers
app.get('/', respondText);
app.get('/json', respondJson);
app.get('/echo', respondEcho);
app.get('/static/*', respondStatic);
app.get('/chat', respondChat);
app.get('/sse', respondSSE);

// Start the server and log a message when it's listening
app.listen(port, () => console.log(`Server listening on port ${port}`));

// Handler function for the root route '/'
function respondText(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.end('hi');
}

// Handler function for the '/json' route
function respondJson(req, res) {
    res.json({ text: 'hi', numbers: [1, 2, 3] });
}

// Handler function for the '/echo' route
function respondEcho(req, res) {
    const { input = '' } = req.query;
    res.json({
        normal: input,
        shouty: input.toUpperCase(),
        characterCount: input.length,
        backwards: input
            .split('')
            .reverse()
            .join('')
    });
}

// Handler function for serving static files under '/static/*' route
function respondStatic(req, res) {
    const filename = `${__dirname}/mychat/${req.params[0]}`;
    fs.createReadStream(filename)
        .on('error', () => respondNotFound(req, res))
        .pipe(res);
}

// Handler function for the '/chat' route
function respondChat(req, res) {
    const { message } = req.query;
    chatEmitter.emit('message', message);
    res.end();
}

// Handler function for the '/sse' route (Server-Sent Events)
function respondSSE(req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive'
    });
    const onMessage = msg => res.write(`data: ${msg}\n\n`);
    chatEmitter.on('message', onMessage);
    res.on('close', function () {
        chatEmitter.off('message', onMessage);
    });
}

// Handler function for 'Not Found'
function respondNotFound(req, res) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
}
