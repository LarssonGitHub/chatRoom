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

async function getUserName(wsId) {
    const userObj = await getUser(wsId);
    return userObj.userName;
}

// For the bot
async function botWelcomeMsg(wsId) {
    const userObj = await getUserName(wsId);
    const constructedMessage = formatToChatObj("botMsg", "Mr Bot", `${userObj} has joined!`)
    const message = validateMessage(constructedMessage)
    return message;
}

async function botGoodbyeMsg(wsId) {
    const userObj = await getUserName(wsId);
    const constructedMessage = formatToChatObj("botMsg", "Mr Bot", `${userObj} has left the chat!`)
    const message = validateMessage(constructedMessage)
    return message;

}

async function botErrorMsg(wsId, errorReason) {
    const userObj = await getUserName(wsId);
    const constructedMessage = formatToChatObj("botMsg", "Mr Bot", `Your post wasn't approved ${userObj}! Reason: ${errorReason} (only you can see this!)`)
    const message = validateMessage(constructedMessage)
    return message;
}

// For the client
function handleIncomingClientData(incomingData) {
    return validateTypeOfIncomingMsg(incomingData);
}

async function handleOutgoingDataToClient(validatedData, wsId) {
    const {type, data, imgData} = validatedData;
    const userObj = await getUserName(wsId);
    const restructureChatObj = formatToChatObj(type, userObj, data, imgData)
    return validateTypeOfOutgoingMsg(restructureChatObj);
}

// For statuses
function mapUsernames(arrayOfUsers) {
    return arrayOfUsers.map(user => user.userName);
}

async function clientList() {
    const arrayOfUsers = await getUsersOnline();
    const arrayOfUsernames = mapUsernames(arrayOfUsers)
    const constructedMessage = formatToStatusObj("status", "clientArray", arrayOfUsernames);
    const message = validateMessage(constructedMessage)
    return message;
}
async function clientSize() {
    const arrayOfUsers = await getUsersOnline();
    console.log(arrayOfUsers);
    const constructedMessage = formatToStatusObj("status", "clientInteger", arrayOfUsers.length);
    const message = validateMessage(constructedMessage)
    return message;
}

export {
    botWelcomeMsg,
    botGoodbyeMsg,
    botErrorMsg,
    handleIncomingClientData,
    handleOutgoingDataToClient,
    clientSize,
    clientList,
    getUserName
}