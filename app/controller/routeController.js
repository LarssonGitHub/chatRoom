import {
    setIdAndStatusForWebsocket,
    removeIdAndStatusForWebsocket
} from "../models/userModel.js";

import {
    errHasSensitiveInfo
} from "./errorHandling.js"

import {
    getCollectionOfGallery,
} from "../models/galleryModel.js"

import {
    registerNewUser,
    loginUser
} from "../controller/authentication.js";

import dotenv from 'dotenv';

dotenv.config();

const {
    SESSION_NAME,
} = process.env;

let tempIdBecauseSessionHatesWebsockets = 0;

async function renderIndex(req, res, next) {
    try {
        const UserStatsSuccess = await setIdAndStatusForWebsocket(req.session.user);
        if (!UserStatsSuccess) {
            throw "couldn't set new stats"
        }
        req.session.userId = UserStatsSuccess._id;
        tempIdBecauseSessionHatesWebsockets = UserStatsSuccess.tempWebsocketId;
        res.status(200).render('pages/index');
    } catch (err) {
        const errMessage = errHasSensitiveInfo(err);
        res.status(404).json({
            err: errMessage,
        })
    }
}

function renderLogin(req, res, next) {
    res.status(200).render('pages/login');
}

function logout(req, res, next) {
    removeIdAndStatusForWebsocket(req.session.userId);
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
            res.status(404).redirect('/')
            return
        }
        res.clearCookie(SESSION_NAME);
        console.log('cookie destroyed');
        res.status(200).redirect('/')
    });
}

async function submitLogin(req, res, next) {
    try {
        const {
            userName,
            userPassword
        } = req.body;
        const userIsValidated = await loginUser(userName, userPassword);
        if (userIsValidated) {
            req.session.userHasAccess = true;
            req.session.user = userIsValidated;
            res.status(200).json({
                redirectTo: '/',
                message: "user exist and is validated, logging in!"
            })
            return;
        }
        throw "Something went... Kind of wrong, not sure what but it did!"
    } catch (err) {
        const errMessage = errHasSensitiveInfo(err);
        res.status(404).json({
            err: errMessage,
        })
    }
}

function renderRegistrar(req, res, next) {
    res.render('pages/register');
}

async function submitRegistrar(req, res, next) {
    try {
        const {
            userName,
            userPassword
        } = req.body;
        const userWasRegister = await registerNewUser(userName, userPassword);
        if (userWasRegister) {
            res.status(200).json({
                redirectTo: '/login',
                message: "new user added, log in!"
            })
            return;
        }
        throw "Something went wrong on our end when registering a new user";
    } catch (err) {
        const errMessage = errHasSensitiveInfo(err);
        res.status(404).json({
            err: errMessage,
        })
    }
}

async function fetchGallery(req, res, next) {
    try {
        const collectionExist = await getCollectionOfGallery();
        if (collectionExist || collectionExist.length > 0) {
            res.json(collectionExist);
            return;
        }
        throw "Something went wrong on our end when fetching for gallery";
    } catch (err) {
        const errMessage = errHasSensitiveInfo(err);
        res.status(404).json({
            err: errMessage,
        })
    }
}

function pageNotfound(req, res, next) {
    console.log("Don't try to go to a side that doesn't exist!");
    res.status(200).redirect("/")
}

export {
    renderIndex,
    renderLogin,
    submitLogin,
    renderRegistrar,
    submitRegistrar,
    logout,
    fetchGallery,
    pageNotfound,
    tempIdBecauseSessionHatesWebsockets
}