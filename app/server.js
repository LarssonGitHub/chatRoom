"use strict"



import WebSocket, {
    WebSocketServer
} from 'ws';

import express from 'express';
import http from 'http';
import session from 'express-session';

import {
    validateTypeOfOutgoingMessage,
    validateTypeOfIncomingMessage,
} from './controller/controller.js';

const app = express();
const server = http.createServer(app);

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); 



// TODO SET THIS IN A ENV. FILE!
app.use(session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
}))


// const wss = new WebSocketServer({noServer: true});
const wss = new WebSocketServer({
    server
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

server.listen(process.env.PORT || 8999, () => {
    console.log(`Server started on port :)`);
});



// app.get("/", (req, res) => {

// })

// const router = express.Router();