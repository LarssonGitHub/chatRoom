import {
    validateTypeOfOutgoingMessage,
    validateTypeOfIncomingMessage,
    formatToChatObj,
    formatToStatusObj
} from './messages.js';

import {getCurrentUser} from "../controller/websocketUsers.js"


async function botWelcomeMessage(wsId) {
    const userObj = await getCurrentUser(wsId);
    const message = formatToChatObj("botMsg", "Mr Bot", `${userObj} has joined!`)
    const validatedMessage = validateTypeOfOutgoingMessage(message);
    return validatedMessage;
}

async function botGoodbyeMessage(wsId) {
    const userObj = await getCurrentUser(wsId);
    const message = formatToChatObj("botMsg", "Mr Bot", `${userObj} has left the chat!`)
    const validatedMessage = validateTypeOfOutgoingMessage(message);
    return validatedMessage;
}

async function botErrorMessage(wsId, errorReason) {
    const userObj = await getCurrentUser(wsId);
    const message = formatToChatObj("botMsg", "Mr Bot", `Your post wasn't approved ${userObj}! Reason: ${errorReason} (only you can see this!)`)
    const validatedMessage = validateTypeOfOutgoingMessage(message);
    return validatedMessage;
}

export {
    botWelcomeMessage,
    botGoodbyeMessage,
    botErrorMessage
}