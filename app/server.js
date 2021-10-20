"use strict"
import WebSocket, {
    WebSocketServer
} from 'ws';

import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

import {router} from './routes/routes.js';
import {
    tempIdBecauseSessionHatesWebsockets,
} from "./controller/routeController.js"

import {
    validateTypeOfOutgoingMessage,
    validateTypeOfIncomingMessage,
    formatToChatObj,
    formatToStatusObj
} from './utilities/messages.js';

import {
    botWelcomeMessage,
    botGoodbyeMessage,
    botErrorMessage
} from './utilities/botmessages.js';
import {
    handleIncomingData,
    handleOutgoingData
} from './utilities/clientMessages.js';

import {
    clientSize,
    clientList
} from "./utilities/statusMessages.js";
import {
    resetDatabaseUsers,
    setIdAndStatusForWebsocket,
    removeIdAndStatusForWebsocket
} from "./models/userModel.js";


// Safe measure if server crashes and restarts!
resetDatabaseUsers();

const app = express();
const server = http.createServer(app);

dotenv.config();
const {
    PORT,
    connectionStream,
    SESSION_LIFETIME,
    NODE_ENV,
    SESSION_NAME,
    SESSION_SECRET,
} = process.env;

mongoose.connect(connectionStream, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connection to DB chat Successfully!');
}).catch(err => {
    console.log('Connection to DB Failed', err);
    process.exit()
})

// const wss = new WebSocketServer({noServer: true});
const wss = new WebSocketServer({
    server
});

app.use(bodyParser.json());
app.use(express.static("public"));
app.use(router);
app.set('view engine', 'ejs');


// TODO on connection: set a unique id on client
wss.on('connection', async (ws, req) => {
    ws.id = tempIdBecauseSessionHatesWebsockets;
    console.log(`Client connected from IP ${ws._socket.remoteAddress}`);
    broadcast(await botWelcomeMessage(ws.id));
    broadcast(await clientSize());
    broadcast(await clientList());

    ws.on("close", async () => {
        // TODO put this in removeid in an await?????!
        removeIdAndStatusForWebsocket(ws.id);
        broadcast(await clientSize());
        broadcast(await clientList());
        broadcast(await botGoodbyeMessage(ws.id));
    });

    ws.on("message", async (data) => {
        let validatedData = await handleIncomingData(data, ws.id);
        if (validatedData === "ERROR, don't mess with my javascript client!") {
            broadcastToSingleClient(await botErrorMessage(ws.id, validatedData), ws.id);
        }
        let handledOutgoingData = await handleOutgoingData(validatedData, ws.id);
        broadcast(handledOutgoingData);
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

function broadcastToSingleClient(data, specificUserId) {
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            if (client.id === specificUserId) {
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

server.listen(process.env.PORT || PORT, () => {
    console.log(`Server started on`, PORT);
});