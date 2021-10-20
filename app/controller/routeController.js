import {
    setIdAndStatusForWebsocket,
} from "../models/userModel.js";

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

function renderIndex(req, res) {
    res.status(200).render('pages/index');
}

function renderLogin(req, res) {
    res.render('pages/login');
}

function logout(req, res) {
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
}

async function submitLogin(req, res) {
    try {
        const {
            userName,
            userPassword
        } = req.body;
        const userIsValidated = await loginUser(userName, userPassword);
        if (userIsValidated) {
            const UserStatsSuccess = await setIdAndStatusForWebsocket(userIsValidated);
            if (!UserStatsSuccess) {
                throw "couldn't set new stats"
            }
            req.session.userHasAccess = true;
            tempIdBecauseSessionHatesWebsockets = UserStatsSuccess.tempWebsocketId;
            res.json({
                redirectTo: '/',
                message: "user exist and is validated, logging in!"
            })
            return;
        }
        throw "Something went... Kind of wrong, not sure what but it did!"
    } catch (err) {
        res.json({
            err: err,
        })
    }
}

function renderRegistrar(req, res){
    res.render('pages/register');
}

async function submitRegistrar (req, res) {
    try {
        const {
            userName,
            userPassword
        } = req.body;
        const userWasRegister = await registerNewUser(userName, userPassword);
        if (userWasRegister) {
            res.json({
                redirectTo: '/login',
                message: "new user added, log in!"
            })
            return;
        }
        throw "Something went wrong on our end when registering a new user";
    } catch (err) {
        res.json(err);
    }
}

async function fetchGallery(req, res) {
    try {
        const collectionExist = await getCollectionOfGallery();
        if (collectionExist || collectionExist.length > 0) {
            res.json(collectionExist);
            return;
        }
        throw "Something went wrong on our end when fetching for gallery";
    } catch (err) {
        res.json(err);
    }
}


export {
    renderIndex,
    renderLogin,
    submitLogin,
    renderRegistrar,
    submitRegistrar,
    logout,
    fetchGallery,
    tempIdBecauseSessionHatesWebsockets
}