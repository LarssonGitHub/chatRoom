"use strict"



import WebSocket, {
    WebSocketServer
} from 'ws';

import express from 'express';
import http from 'http';
import session from 'express-session';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import {
    validateTypeOfOutgoingMessage,
    validateTypeOfIncomingMessage,
    formatToChatObj,
    formatToStatusObj
} from './utilities/messages.js';
import {getCollectionOfGallery} from "./controller/controller.js"
dotenv.config();
const {
    PORT,
    connectionStream
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

// TODO Just a temp, this will be taken from list of users, either database or the session itself!
let clientsArray = []

// TODO on connection: set a unique id on client
wss.on('connection', (ws, req) => {
    console.log(`Client connected from IP ${ws._socket.remoteAddress}`);
    clientsArray.push(wss.clients.size);


    let clientSize = formatToStatusObj("status", "clientInteger", wss.clients.size)
    broadcast(validateTypeOfOutgoingMessage(clientSize));

    // TODO Just a temp..!
    let clientsOnline = formatToStatusObj("status", "clientArray", clientsArray)
    broadcast(validateTypeOfOutgoingMessage(clientsOnline));

    // TODO replace req.username with the user who logs in
    let BotWelcomeMsg = formatToChatObj("botMsg", "Mr Bot", "req.user.name... has joined!")
    broadcast(validateTypeOfOutgoingMessage(BotWelcomeMsg));

    // Bot close event msg > validate > send goodbye message > broadcast how many clients online
    ws.on("close", () => {

        let ClientSizeMsg = formatToStatusObj("status", "clientInteger", wss.clients.size);
        broadcast(validateTypeOfOutgoingMessage(ClientSizeMsg));

        clientsArray.pop();
        let clientsOnline = formatToStatusObj("status", "clientArray", clientsArray)
        broadcast(validateTypeOfOutgoingMessage(clientsOnline));

        let BotGoodbyeMsg = formatToChatObj("botMsg", "Mr Bot", "req.user.name... left the the chat!")
        broadcast(validateTypeOfOutgoingMessage(BotGoodbyeMsg));
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

app.get("/login/", (req,res) => {
    res.render('pages/login');
})

app.post("/login/", (req,res) => {
    res.render('pages/index');
})

app.get("/register/", (req,res) => {
    res.render('pages/register');
})

app.post("/register/", (req,res) => {
    res.render('pages/index');
})

app.get("/gallery/", async (req, res) => {
    const collection = await getCollectionOfGallery();
    console.log(collection);
    // TODO put it into an object and error handle!
    res.json(collection);
})

// TODO.... use render and shit I think... With session to see if user is okay or not then use this for the bot to show username of whoever joins
// , then ue the session as the one which validates the users input, and if it is, display the render.. Or something. If not, terminate the connection
// app.get("/login", (req, res) => {

// })
// Or save
server.listen(process.env.PORT || PORT, () => {
    console.log(`Server started`);
});