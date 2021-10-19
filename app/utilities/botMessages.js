import {
    validateTypeOfOutgoingMessage,
    validateTypeOfIncomingMessage,
    formatToChatObj,
    formatToStatusObj
} from './messages.js';

import {getCurrentUser} from "../controller/websocketUsers.js"


async function botWelcomeMessage(wsId) {
    const userObj = await getCurrentUser(wsId);
    // console.log("Hello from botwelcome", userName);
    const message = formatToChatObj("botMsg", "Mr Bot", `${userObj} has joined!`)
    const validatedMessage = validateTypeOfOutgoingMessage(message);
    return validatedMessage;
}

export {
    botWelcomeMessage
}