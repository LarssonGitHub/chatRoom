"use strict"
console.log("fuck you");
import WebSocket, {
    WebSocketServer
} from 'ws';

const wss = new WebSocketServer({
    port: 8081
});

wss.on('connection', (ws) => {

    console.log(`Client connected from IP ${ws._socket.remoteAddress}`);
    console.log(`Number of connected clients: ${wss.clients.size}`);

    ws.on("close", () => {
        console.log("Client disconnected");
    });
});


wss.broadcastButExclude = function (data, someClient) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            if (client !== someClient) {}
            client.send(data)
        }
    })}

wss.broadcast = function (data) {
    wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(data)
            }
        })}