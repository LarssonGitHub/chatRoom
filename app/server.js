"use strict"
import WebSocket, {
    WebSocketServer
} from 'ws';
import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import {
    v4 as uuidv4
} from 'uuid';

import {
    router
} from './routes/routes.js';

import {
    botWelcomeMsg,
    botGoodbyeMsg,
    botErrorPrivateMsg,
    handleIncomingClientData,
    handleOutgoingDataToClient,
    botErrorPublicMsg,
    clientSize,
    clientList
} from './controller/messageHandling.js';

import {
    resetDatabaseUsers,
    removeIdAndStatusForWebsocket,
    setIdAndStatusForWebsocket
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

const wss = new WebSocketServer({
    server
});

app.use(express.urlencoded({
    extended: false
}));
app.use(express.json());
app.use(express.static("public"));
app.use(router);
app.set('view engine', 'ejs');

wss.on('connection', async (ws, req) => {
    try {

        console.log(`Client connected from IP ${ws._socket.remoteAddress}`);
        ws.id = uuidv4();
        console.log("new user set as online!", await setIdAndStatusForWebsocket(ws.id));
        broadcast(await botWelcomeMsg(ws.id))
        broadcast(await clientSize())
        broadcast(await clientList(ws.id))

        ws.on("close", async () => {
            try {
                console.log("old user set as offline!", await removeIdAndStatusForWebsocket(ws.id));
                broadcast(await clientSize())
                broadcast(await clientList(ws.id))
            } catch (err) {
                broadcast(await botErrorPublicMsg(err));
            }
        });

        ws.on("message", async (data) => {
            
            let validatedData = await handleIncomingClientData(data, ws.id);
            console.log(data);
            if (validatedData.err === "ERROR") {
                broadcastToSingleClient(await botErrorPrivateMsg(ws.id, validatedData.msg), ws.id);
                return;
            }
            let handledOutgoingData = await handleOutgoingDataToClient(validatedData, ws.id);
            if (handledOutgoingData.err === "ERROR") {
                broadcastToSingleClient(await botErrorPrivateMsg(ws.id, handledOutgoingData.msg), ws.id);
                return;
            }
            broadcast(handledOutgoingData);

        })

    } catch (err) {
        if (err === "updateUserErr") {
            ws.terminate("User has been terminated", 500);
            return;
        }
        broadcast(await botErrorPublicMsg(err));
    }
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