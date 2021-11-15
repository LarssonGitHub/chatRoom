import express from 'express';

import session, {
    MemoryStore
} from 'express-session';

import dotenv from 'dotenv';

import {
    checkUserAccess,
    denyUserRoute
} from "../middleware/accession.js";


import {
    renderIndex,
    renderLogin,
    submitLogin,
    renderRegistrar,
    submitRegistrar,
    logout,
    fetchGallery,
    fetchChatHistory
} from "../controller/routeController.js"

const router = express.Router();
dotenv.config();

const {
    SESSION_LIFETIME,
    NODE_ENV,
    SESSION_NAME,
    SESSION_SECRET,
} = process.env;

router.use(session({
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

router.get("/", checkUserAccess, renderIndex);

router.get('/logout', checkUserAccess, logout);

router.get("/login/", denyUserRoute, renderLogin);

router.post("/login/", denyUserRoute, submitLogin);

router.get("/register/", denyUserRoute, renderRegistrar);

router.post("/register/", denyUserRoute, submitRegistrar);

router.get("/gallery/", checkUserAccess, fetchGallery);

router.get("/chatHistory/:startIndex", checkUserAccess, fetchChatHistory);

export {
    router,
}