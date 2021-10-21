import {
    validateTypeOfOutgoingMsg,
    validateTypeOfIncomingMsg,
    formatToChatObj,
    formatToStatusObj
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
    const message = formatToChatObj("botMsg", "Mr Bot", `${userObj} has joined!`)
    const validatedMsg = validateTypeOfOutgoingMsg(message);
    return validatedMsg;
}

async function botGoodbyeMsg(wsId) {
    const userObj = await getUserName(wsId);
    const message = formatToChatObj("botMsg", "Mr Bot", `${userObj} has left the chat!`)
    const validatedMsg = validateTypeOfOutgoingMsg(message);
    return validatedMsg;
}

async function botErrorMsg(wsId, errorReason) {
    const userObj = await getUserName(wsId);
    const message = formatToChatObj("botMsg", "Mr Bot", `Your post wasn't approved ${userObj}! Reason: ${errorReason} (only you can see this!)`)
    const validatedMsg = validateTypeOfOutgoingMsg(message);
    return validatedMsg;
}

// For the client
function handleIncomingClientData(incomingData) {
    return validateTypeOfIncomingMsg(incomingData);
}

async function handleOutgoingDataToClient(validatedData, wsId) {
    const userObj = await getUserName(wsId);
    validatedData.user = userObj;
    return validateTypeOfOutgoingMsg(validatedData);
}

// For statuses
function mapUsernames(arrayOfUsers) {
    return arrayOfUsers.map(user => user.userName);
}

async function clientList() {
    const arrayOfUsers = await getUsersOnline();
    const arrayOfUsernames = mapUsernames(arrayOfUsers)
    const ClientListMsg = formatToStatusObj("status", "clientArray", arrayOfUsernames);
    const validatedStatusMsg = validateTypeOfOutgoingMsg(ClientListMsg);
    return validatedStatusMsg;
}
async function clientSize() {
    const arrayOfUsers = await getUsersOnline();
    console.log(arrayOfUsers);
    const ClientSizeMsg = formatToStatusObj("status", "clientInteger", arrayOfUsers.length);
    const validatedStatusMsg = validateTypeOfOutgoingMsg(ClientSizeMsg);
    return validatedStatusMsg;
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