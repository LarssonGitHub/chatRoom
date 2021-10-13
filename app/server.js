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
    formatMessage
} from './utilities/messages.js';

const app = express();
const server = http.createServer(app);

// const wss = new WebSocketServer({noServer: true});
const wss = new WebSocketServer({
    server
});
app.use(session({
    secret: "foryoureyesonly%tXl!p",
    resave: false,
    saveUninitialized: true
}));

app.use(express.static("public"));
app.set('view engine', 'ejs');

// TODO on connection: set a unique id on client
wss.on('connection', (ws, req) => {
    console.log(`Client connected from IP ${ws._socket.remoteAddress}`);
    console.log(wss.clients.size);

    let ClientSizeMsg = formatMessage("status", "", wss.clients.size)
    broadcast(validateTypeOfOutgoingMessage(ClientSizeMsg));

    // TODO replace req.username with the user who logs in
    let BotWelcomeMsg = formatMessage("botMsg", "Mr Bot", "req.user.name... has joined!")
    broadcast(validateTypeOfOutgoingMessage(BotWelcomeMsg));

    // Bot close event msg > validate > send goodbye message > broadcast how many clients online
    ws.on("close", () => {
        let BotGoodbyeMsg = formatMessage("botMsg", "Mr Bot", "req.user.name... left the the chat!")
        broadcast(validateTypeOfOutgoingMessage(BotGoodbyeMsg));

        let ClientSizeMsg = formatMessage("status", "", wss.clients.size)
        broadcast(validateTypeOfOutgoingMessage(ClientSizeMsg));
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

// Ask about this...:! ClientsOnline.
app.get("/", (req, res) => {
    res.render('pages/index');
})

// TODO.... use render and shit I think... With session to see if user is okay or not then use this for the bot to show username of whoever joins
// , then ue the session as the one which validates the users input, and if it is, display the render.. Or something. If not, terminate the connection
// app.get("/login", (req, res) => {

// })
// Or save
server.listen(process.env.PORT || 8999, () => {
    console.log(`Server started`);
});