const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });
let counter = 0;

wss.on('connection', (ws) => {
    console.log('A new client connected!');
    ws.send(JSON.stringify({ type: 'counter', value: counter }));

    ws.on('message', (message) => {
        console.log('Received:', message.toString());

        // increment counter
        if (message.toString() === 'increment') {
            counter++;
            console.log('Counter:', counter);
            broadcast(JSON.stringify({ type: 'counter', value: counter }));
        }

        // reset counter
        if (message.toString() === 'reset') {
            counter = 0;
            console.log('Counter:', counter);
            broadcast(JSON.stringify({ type: 'counter', value: counter }));
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

function broadcast(data) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
}

console.log('WebSocket server running on ws://localhost:8080');
