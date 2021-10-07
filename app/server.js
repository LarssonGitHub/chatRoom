"use strict"

import WebSocket, {
    WebSocketServer
} from 'ws';

import {
    validateTypeOfOutgoingMessage,
    validateTypeOfIncomingMessage,
} from './controller/controller.js';

const wss = new WebSocketServer({
    port: 8081
});

// TODO on connection: set a unique id on client
wss.on('connection', (ws, req) => {
    console.log(`Client connected from IP ${ws._socket.remoteAddress}`);

                    // broadcast how many clients online
                    let objClientSizeMsg = {
                            type: "status",
                            data: wss.clients.size
                        };
                    let validatedClientSizeMsg = validateTypeOfOutgoingMessage(objClientSizeMsg);
                    broadcast(validatedClientSizeMsg);

            // Bot welcome message, msg > validate > send
            let objBotWelcomeMsg = {
                type: "botMsg",
                user: "Mr Bot",
                data: "req.user.name... has joined!"
            };
            let validatedBotWelcomeMsg = validateTypeOfOutgoingMessage(objBotWelcomeMsg);
            broadcast(validatedBotWelcomeMsg);

    // Bot close event msg > validate > send goodbye message > broadcast how many clients online
    ws.on("close", () => {
        let objBotCloseMsg = {
            type: "botMsg",
            user: "Mr Bot",
            data: "req.user.name... left the the chat!"
        };
        let validatedBotCloseMsg = validateTypeOfOutgoingMessage(objBotCloseMsg);
        broadcast(validatedBotCloseMsg);
        
        objClientSizeMsg.data = wss.clients.size
        let validatedClientSizeMsg = validateTypeOfOutgoingMessage(objClientSizeMsg);
        broadcast(validatedClientSizeMsg);
    });

    ws.on("message", (data) => {
        let validatedIncomingMsg = validateTypeOfIncomingMessage(data);
        let validatedOutgoingMsg = validateTypeOfOutgoingMessage(validatedIncomingMsg);
        broadcastButExclude(validatedOutgoingMsg, ws)
    })
});

function broadcastButExclude(data, someClient) {
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            if (client !== someClient) {
                client.send(data);
            }
        }
    });
}

function broadcast(data) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data)
        }
    })
}