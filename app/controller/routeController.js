import {
    removeIdAndStatusForWebsocket
} from "../models/userModel.js";

import {
    errHasSensitiveInfo
} from "./errorHandling.js"

import {
    getCollectionOfGallery,
    getChatPagination
} from "../models/chatModel.js"

import {
    registerNewUser,
    loginUser,
    usersInTempMemory
} from "../controller/authentication.js";

import dotenv from 'dotenv';

dotenv.config();

const {
    SESSION_NAME,
} = process.env;

async function renderIndex(req, res, next) {
    try {
        req.session.userHasLoggedIn = true;
        usersInTempMemory.push(req.session.user._id)
        res.status(200).render('pages/index');
    } catch (err) {
        console.log(err, "14");
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
    req.session.destroy((err) => {
        if (err) {
            console.log(err, "from route controller");
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
        console.log(err, "15");
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
        console.log(err, "16");
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
            res.json({message: collectionExist});
            return;
        }
        throw "Something went wrong on our end when fetching for gallery";
    } catch (err) {
        console.log(err, "17");
        const errMessage = errHasSensitiveInfo(err);
        res.status(404).json({
            err: errMessage,
        })
    }
}

// Unused routes, created a conflict which reset the middleware, aka userHasLoggedIn
// function pageNotfound(req, res, next) {
//     console.log("Don't try to go to a side that doesn't exist!");
//     res.status(200).redirect("/")
// }
// router.get('*', pageNotfound);
// router.post('*', pageNotfound);
// router.put('*', pageNotfound);
// router.delete('*', pageNotfound);

async function fetchChatHistory(req, res) {
    try {
        const {
            startIndex
        } = req.params;
        const chatPagination = await getChatPagination(startIndex);
        console.log("chat pagination", chatPagination);
        if (chatPagination || chatPagination.length > 0) {
            res.json({message: chatPagination});
            return;
        }
        throw "Something went wrong on our end when fetching for chats";
    } catch (err) {
        console.log(err, "18");
        const errMessage = errHasSensitiveInfo(err);
        res.status(404).json({
            err: errMessage,
        })
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
    fetchChatHistory,
}