"use strict"
import WebSocket, {
    WebSocketServer
} from 'ws';
import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

import {
    router
} from './routes/routes.js';

import {
    tempIdBecauseSessionHatesWebsockets,
} from "./controller/routeController.js"

import {
    botWelcomeMsg,
    botGoodbyeMsg,
    botErrorMsg,
    handleIncomingClientData,
    handleOutgoingDataToClient,
    clientSize,
    clientList
} from './controller/messageHandling.js';

import {
    resetDatabaseUsers,
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

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));
app.use(router);
app.set('view engine', 'ejs');


// TODO on connection: set a unique id on client
wss.on('connection', async (ws, req) => {
    ws.id = tempIdBecauseSessionHatesWebsockets;
    console.log(`Client connected from IP ${ws._socket.remoteAddress}`);
    broadcast(await botWelcomeMsg(ws.id));
    broadcast(await clientSize());
    broadcast(await clientList());

    ws.on("close", async () => {
        // TODO put this in removeid in an await?????!
        removeIdAndStatusForWebsocket(ws.id);
        broadcast(await clientSize());
        broadcast(await clientList());
        broadcast(await botGoodbyeMsg(ws.id));
    });

    ws.on("message", async (data) => {
        let validatedData = await handleIncomingClientData(data, ws.id);
        if (validatedData === "ERROR, don't mess with my javascript client!") {
            broadcastToSingleClient(await botErrorMsg(ws.id, validatedData), ws.id);
            return;
        }
        let handledOutgoingData = await handleOutgoingDataToClient(validatedData, ws.id);
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