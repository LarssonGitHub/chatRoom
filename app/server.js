"use strict"



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
    getCollectionOfGallery
} from "./controller/database.js"
import {
    registerNewUser,
    loginUser
} from "./controller/authentication.js"
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
wss.on('connection', (ws, req) => {
    console.log(`Client connected from IP ${ws._socket.remoteAddress}`);
    // clientsArray.push(wss.clients.size);
    // session(req.upgradeReq, {}, function(){
    //     console.log(req.session);
    //     // do stuff with the session here
    // });

    let clientSize = formatToStatusObj("status", "clientInteger", wss.clients.size)
    broadcast(validateTypeOfOutgoingMessage(clientSize));

    // TODO Just a temp..!
    let clientsOnline = formatToStatusObj("status", "clientArray", clientsArray)
    broadcast(validateTypeOfOutgoingMessage(clientsOnline));

    // TODO replace req.username with the user who logs in
    let BotWelcomeMsg = formatToChatObj("botMsg", "Mr Bot", `${req.session}... has joined!`)
    broadcast(validateTypeOfOutgoingMessage(BotWelcomeMsg));

    // Bot close event msg > validate > send goodbye message > broadcast how many clients online
    ws.on("close", (ws) => {

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

app.get("/", checkUserAccess, (req, res) => {
    res.render('pages/index');
})

app.get('/logout', checkUserAccess, (req,res) => {
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
    const {
        userName,
        userPassword
    } = req.body;
    const user = await loginUser(userName, userPassword);
console.log(user);
console.log(user.userName);
    if (!user === "failure") {
        // console.log("fffaaaaailll");
        res.json("There ain't no user here :<");
    }
    req.session.userHasAccess = true;
    req.session.user = user.userName;
    // req.session.userId = user.id;
    console.log(req.session.user)
    res.json({ redirectTo: '/', message: "user exist and logging in!"})
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
        res.json({ redirectTo: '/login', message: "new user added, log in!" })
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