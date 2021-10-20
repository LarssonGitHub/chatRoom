
import {
    validateTypeOfOutgoingMessage,
    validateTypeOfIncomingMessage,
    formatToChatObj,
    formatToStatusObj
} from './messages.js';

import {getUsersOnline} from "../controller/database.js"

function mapUsernames(arrayOfUsers) {
    console.log(arrayOfUsers);
    return arrayOfUsers.map(user => user.userName);
}

async function clientList() {
    const arrayOfUsers = await getUsersOnline();
    const arrayOfUsernames = mapUsernames(arrayOfUsers)
    const ClientListMsg = formatToStatusObj("status", "clientArray", arrayOfUsernames);
    const validatedStatusMsg = validateTypeOfOutgoingMessage(ClientListMsg);
    return validatedStatusMsg;
}
async function clientSize() {
    const arrayOfUsers = await getUsersOnline();
    const ClientSizeMsg = formatToStatusObj("status", "clientInteger", arrayOfUsers.length);
    const validatedStatusMsg = validateTypeOfOutgoingMessage(ClientSizeMsg);
    return validatedStatusMsg;
}
export {
    clientSize,
    clientList
}
