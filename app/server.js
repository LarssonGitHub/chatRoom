"use strict"



import WebSocket, {
    WebSocketServer
} from 'ws';

import express from 'express';
import http from 'http';
import session from 'express-session';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

import {
    validateTypeOfOutgoingMessage,
    validateTypeOfIncomingMessage,
    formatToChatObj,
    formatToStatusObj
} from './utilities/messages.js';
import {
    getCollectionOfGallery
} from "./controller/database.js"
import {
    registerNewUser,
    loginUser
} from "./controller/authentication.js"
import {
    checkAccession
} from "./middleware/accession.js"
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

app.use(bodyParser.json());
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

app.use(session({
    secret: "foryoureyesonly%tXl!p",
    resave: false,
    saveUninitialized: true
}));

app.get("/", checkAccession, (req, res) => {
    res.render('pages/index');
})

app.get("/login/", (req, res) => {
    res.render('pages/login');
})

app.post("/login/", async (req, res) => {
    const {
        userName,
        userPassword
    } = req.body;
    const user = await loginUser(userName, userPassword);
    if (user === "success") {
        res.json("User exist and you logged in!");
        return;
    }
    res.json("There ain't no user here :<");
})

app.get("/register/", (req, res) => {
    res.render('pages/register');
})

app.post("/register/", async (req, res) => {
    const {
        userName,
        userPassword
    } = req.body;
    const newUser = await registerNewUser(userName, userPassword);
    console.log(newUser);
    if (newUser === "success") {
        res.json("new user added, log in!");
        return;
    }
    res.json("New user did not add :<");
})

app.get("/gallery/", async (req, res) => {
    const collection = await getCollectionOfGallery();
    // TODO put it into an object and error handle!
    res.json(collection);
})

server.listen(process.env.PORT || PORT, () => {
    console.log(`Server started`);
});