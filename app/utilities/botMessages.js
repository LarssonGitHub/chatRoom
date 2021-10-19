import {
    validateTypeOfOutgoingMessage,
    validateTypeOfIncomingMessage,
    formatToChatObj,
    formatToStatusObj
} from './messages.js';

import {getCurrentUser} from "../controller/websocketUsers.js"


async function botWelcomeMessage(wsId) {
    const userName = await getCurrentUser(wsId);
    console.log("Hello from botwelcome", userName);
     return userName;
    // const message = formatToChatObj("botMsg", "Mr Bot", `.. has joined!`)
    // const validatedMessage = validateTypeOfOutgoingMessage(message);
    // return validatedMessage;
}

export {
    botWelcomeMessage
}