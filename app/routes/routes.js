import express from 'express';

import session, {
    MemoryStore
} from 'express-session';

import dotenv from 'dotenv';

import {
    checkUserAccess
} from "../middleware/accession.js";

import {
    renderIndex,
    renderLogin,
    submitLogin,
    renderRegistrar,
    submitRegistrar,
    logout,
    fetchGallery,
    pageNotfound
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

router.get("/login/", renderLogin);

router.post("/login/", submitLogin);

router.get("/register/", renderRegistrar);

router.post("/register/", submitRegistrar);

router.get("/gallery/", checkUserAccess, fetchGallery);

router.get('*', pageNotfound);
router.post('*', pageNotfound);
router.put('*', pageNotfound);
router.delete('*', pageNotfound);

export {
    router,
}