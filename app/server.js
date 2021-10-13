"use strict"



import WebSocket, {
    WebSocketServer
} from 'ws';

import express from 'express';
import http from 'http';

import {
    validateTypeOfOutgoingMessage,
    validateTypeOfIncomingMessage,
} from './controller/controller.js';

const app = express();
const server = http.createServer(app);

// const wss = new WebSocketServer({noServer: true});
const wss = new WebSocketServer({server});

app.use(express.static("public"));
app.set('view engine', 'ejs');

app.locals.clientsOnline = 0;


// TODO on connection: set a unique id on client
wss.on('connection', (ws, req) => {
    console.log(`Client connected from IP ${ws._socket.remoteAddress}`);
    console.log(wss.clients.size);
    clientsOnline = wss.clients.size
                  

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

app.get("/", (req, res) => {
    res.render('pages/index', {clientsOnline});
})

server.listen(process.env.PORT || 8999, () => {
    console.log(`Server started`);
});