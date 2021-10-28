import {
    parseJson,
    stringifyJson
} from '../utilities/functions.js';

import {
    prepareChatSaving
} from "./savingHandling.js"

import moment from 'moment-timezone';


async function validateMessage(message) {
    const validatedMessage = await validateTypeOfOutgoingMsg(message);
    if (validatedMessage.err === "ERROR") {
        const createNewErrorMessage = formatToChatObj("botMsg", "Mr Bot", `${validatedMessage.msg}`)
        return validateTypeOfOutgoingMsg(createNewErrorMessage)
    }
    return validatedMessage;
}

function formatToStatusObj(type, target, data) {
    const statusTemplate = {}
    if (type) {
        statusTemplate.type = type;
    }
    if (target) {
        statusTemplate.target = target;
    }
    if (data) {
        statusTemplate.data = data;
    }
    return statusTemplate;
}

function formatToChatObj(type, user, data, imgData, save) {
    const msgTemplate = {}
    if (type) {
        msgTemplate.type = type;
    }
    if (user) {
        msgTemplate.user = user;
    }
    if (data) {
        msgTemplate.data = data;
    }
    if (imgData) {
        msgTemplate.imgData = imgData;
    }
    if (save) {
        msgTemplate.save = save;
    }
    msgTemplate.time = moment().tz("Europe/Stockholm").format("DD/MM HH:mm:ss");
    return msgTemplate;
}


async function validateTypeOfIncomingMsg(data, wsId) {
    try {
        const parsedData = parseJson(data)
        const msgType = parsedData.type
        switch (msgType) {
            case "chatMsg":
                return parsedData;
            case "botMsg":
                return parsedData;
            case "imageMsg":
                return parsedData;
            default:
                throw "ERROR type problem!";
        }
    } catch (err) {
        console.log("hello from incoming...", err);
        return {
            err: "ERROR",
            msg: err
        };
    }
}

async function validateTypeOfOutgoingMsg(dataObj) {
    try {
        const msgType = dataObj.type
        switch (msgType) {
            case "chatMsg":
                const savedChatClientObj = await prepareChatSaving(dataObj);
                return stringifyJson(savedChatClientObj);
            case "botMsg":
                const savedChatBotObj = await prepareChatSaving(dataObj);
                return stringifyJson(savedChatBotObj);
            case "imageMsg":
                const savedChatImageObj = await prepareChatSaving(dataObj);
                return stringifyJson(savedChatImageObj);
            case "status":
                return stringifyJson(dataObj);
            case "errorMsg":
                return stringifyJson(dataObj);
            default:
                throw "ERROR type problem!";
        }
    } catch (err) {
        console.log("NAAAADA");
        console.log("hello from outgoing...", err);
        return {
            err: "ERROR",
            msg: "Someone's message or a status update wasn't validated in our server! Sorry guys!"
        };
    }
}

export {
    validateTypeOfOutgoingMsg,
    validateTypeOfIncomingMsg,
    formatToChatObj,
    formatToStatusObj,
    validateMessage
}