"use strict"

let tempIdBecauseSessionHatesWebsockets = 0;

import WebSocket, {
    WebSocketServer
} from 'ws';

import express from 'express';
import http from 'http';
import session, {
    MemoryStore
} from 'express-session';
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
    botWelcomeMessage
} from './utilities/botmessages.js';
import {
    getCollectionOfGallery,
    setIdAndStatusForWebsocket
} from "./controller/database.js"
import {
    registerNewUser,
    loginUser
} from "./controller/authentication.js"
import {
    userJoin,
} from "./controller/websocketUsers.js"

import {
    checkUserAccess
} from "./middleware/accession.js"

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

app.use(session({
    name: SESSION_NAME,
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MemoryStore(),
    cookie: {
        maxAge: Number(SESSION_LIFETIME),
        sameSite: 'strict',
        secure: NODE_ENV === 'production',
    },
}));

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
wss.on('connection', async (ws, req) => {
    ws.id = tempIdBecauseSessionHatesWebsockets;
    console.log(`Client connected from IP ${ws._socket.remoteAddress}`);

    // console.log("hello from server websocket", await botWelcomeMessage(ws.id));

    broadcast(await botWelcomeMessage(ws.id));

    let clientSize = formatToStatusObj("status", "clientInteger", wss.clients.size)
    broadcast(validateTypeOfOutgoingMessage(clientSize));


    // TODO Just a temp..!
    let clientsOnline = formatToStatusObj("status", "clientArray", clientsArray)
    broadcast(validateTypeOfOutgoingMessage(clientsOnline));

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
        console.log(ws.id, "this is the ws id!");
        let validatedIncomingMsg = validateTypeOfIncomingMessage(data);
        let validatedOutgoingMsg = validateTypeOfOutgoingMessage(validatedIncomingMsg);

        // TODO unfinished error function
        // if (validatedOutgoingMsg === "error") {
        //     // TODO Broadcast to user only that their message didn't og through!
        // }
        // let onlyYou = formatToChatObj("botMsg", "Mr Bot", "Only you should see this!")
        // broadcastToSingleClient(JSON.stringify(onlyYou), ws.id)

        broadcast(validatedOutgoingMsg, ws);
    })
});

function broadcastButExclude(data, someClient) {
    wss.clients.forEach(function each(client) {
        console.log("hello", client);
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

    app.get("/", checkUserAccess, (req, res) => {
        res.render('pages/index');
    })

    app.get('/logout', checkUserAccess, (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                console.log(err);
                res.redirect('/')
                return
            }
            res.clearCookie(SESSION_NAME);
            console.log('cookie destroyed');
            res.redirect('/')
        });
    })

    app.get("/login/", (req, res) => {
        res.render('pages/login');
    })

    app.post("/login/", async (req, res) => {
        console.log(req.body);
        const {
            userName,
            userPassword
        } = req.body;
        const user = await loginUser(userName, userPassword);
        if (user === "failure") {
            res.json("There ain't no user here :<");
            return;
        }
        req.session.userHasAccess = true;
        const updatedUser = await setIdAndStatusForWebsocket(user);
        if (updatedUser === "failure") {
            res.json("Couldn't set new stats");
            return;
        }
        tempIdBecauseSessionHatesWebsockets = updatedUser.tempWebsocketId;
        res.json({
            redirectTo: '/',
            message: "user exist and logging in!"
        })
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
            res.json({
                redirectTo: '/login',
                message: "new user added, log in!"
            })
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
        console.log(`Server started on`, PORT);
    });