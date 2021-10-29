import {
    validateTypeOfOutgoingMsg,
    validateTypeOfIncomingMsg,
    formatToChatObj,
    formatToStatusObj,
    validateMessage
} from './messageValidations.js';

import {
    getUsersOnline,
    getUser
} from "../models/userModel.js"

import {
    errHasSensitiveInfo
} from "./errorHandling.js"

async function getUserName(wsId) {
    try {
        const userObj = await getUser(wsId);
        return userObj[0].userName;
    } catch (err) {
        return Promise.reject(err);
    }
}

// For the bot
async function botWelcomeMsg(wsId) {
    try {
        const userObj = await getUserName(wsId);
        const constructedMessage = formatToChatObj("botMsg", "Mr Bot", `${userObj} has joined!`)
        const message = await validateMessage(constructedMessage);
        return message;
    } catch (err) {
        console.log(err);
        return Promise.reject(err);
    }
}

async function botGoodbyeMsg(wsId) {
    try {
        const userObj = await getUserName(wsId);
        const constructedMessage = formatToChatObj("botMsg", "Mr Bot", `${userObj} has left the chat!`)
        const message = await validateMessage(constructedMessage)
        return message;
    } catch (err) {
        return Promise.reject(err);
    }
}

async function botErrorPrivateMsg(wsId, errorReason) {
    try {
        const removeSensitiveErrors = errHasSensitiveInfo(errorReason)
        const userObj = await getUserName(wsId);
        const constructedMessage = formatToChatObj("errorMsg", "Mr Error", `Your post wasn't approved ${userObj}! Reason: ${removeSensitiveErrors} (only you can see this!)`)
        const message = await validateMessage(constructedMessage)
        return message;
    } catch (err) {
        return Promise.reject(err);
    }
}

async function botErrorPublicMsg(errorReason) {
    try {
        const removeSensitiveErrors = errHasSensitiveInfo(errorReason)
        const constructedMessage = formatToChatObj("errorMsg", "Mr Error", `We got an error folks! Reason: ${removeSensitiveErrors}`)
        const message = await validateMessage(constructedMessage)
        return message;
    } catch (err) {
        console.log("Public message didn't go through..", err);
    }
}


// For the client
function handleIncomingClientData(incomingData, wsId) {
    return validateTypeOfIncomingMsg(incomingData, wsId);
}

async function handleOutgoingDataToClient(validatedData, wsId) {
    try {
        const {
            type,
            data,
            imgData,
            save
        } = validatedData;
        const userObj = await getUserName(wsId);
        const restructureChatObj = formatToChatObj(type, userObj, data, imgData, save)
        return validateTypeOfOutgoingMsg(restructureChatObj);
    } catch (err) {
        return Promise.reject(err);
    }

}

// For statuses
function mapUsernames(arrayOfUsers) {
        return arrayOfUsers.map(user => user.userName);
}

async function clientList() {
    try {
        const arrayOfUsers = await getUsersOnline();
        const arrayOfUsernames = mapUsernames(arrayOfUsers)
        const constructedMessage = formatToStatusObj("status", "clientArray", arrayOfUsernames);
        const message = await validateMessage(constructedMessage)
        return message;
    } catch (err) {
        console.log(err);
        return Promise.reject(err);
    }
}

async function clientSize() {
    try {
        const arrayOfUsers = await getUsersOnline();
        const constructedMessage = formatToStatusObj("status", "clientInteger", arrayOfUsers.length);
        const message = await validateMessage(constructedMessage);
        return message;
    } catch (err) {
        console.log(err);
        return Promise.reject(err);
    }
}

export {
    botWelcomeMsg,
    botGoodbyeMsg,
    botErrorPrivateMsg,
    handleIncomingClientData,
    handleOutgoingDataToClient,
    clientSize,
    clientList,
    getUserName,
    botErrorPublicMsg,
}