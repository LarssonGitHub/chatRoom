
import {
    validateTypeOfOutgoingMessage,
    validateTypeOfIncomingMessage,
    formatToChatObj,
    formatToStatusObj
} from './messages.js';

import {getCurrentUser} from "../controller/websocketUsers.js"

function handleIncomingData(incomingData) {
    return validateTypeOfIncomingMessage(incomingData);
}

async function handleOutgoingData(validatedData, wsId) {
    console.log("hello from valdiated...,", validatedData);
    const userObj = await getCurrentUser(wsId);
    validatedData.user = userObj;
    return validateTypeOfOutgoingMessage(validatedData);
}

export {
    handleIncomingData,
    handleOutgoingData
}
