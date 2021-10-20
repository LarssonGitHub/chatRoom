
import {
    validateTypeOfOutgoingMessage,
    validateTypeOfIncomingMessage,
    formatToChatObj,
    formatToStatusObj
} from './messages.js';

function handleIncomingData(validatedIncomingMsg) {
    return validateTypeOfIncomingMessage(validatedIncomingMsg);
}

export {
    handleIncomingData
}
