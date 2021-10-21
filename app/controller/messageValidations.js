import {
    parseJson,
    stringifyJson
} from '../utilities/functions.js'

import {
    saveImgToDatabase
} from "../models/galleryModel.js"

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

function validateMessage(message) {
    const validatedMessage = validateTypeOfOutgoingMsg(message);
    if (validatedMessage.err === "ERROR") {
        const createNewErrorMessage = formatToChatObj("botMsg", "Mr Bot", `${validatedMessage.msg}`) 
        return validateTypeOfOutgoingMsg(createNewErrorMessage)
    }
    return validatedMessage;
 }

function formatToChatObj(type, user, data) {
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
    return msgTemplate;
}


function validateTypeOfIncomingMsg(data, wsId) {
    try {
        const parsedData = parseJson(data)
        const msgType = parsedData.type
        switch (msgType) {
            case "chatMsg":
                return parsedData;
            case "botMsg":
                return parsedData;
            case "imageMsg":
                // TODO...! Make this an if else to save or not!
                saveImgToDatabase(parsedData, wsId);
                return parsedData;
            default:
                throw "ERROR type problem!";
        }
    } catch (err) {
        console.log("hello from incoming...", err);
        return {
            err: "ERROR",
            msg: "ERROR from your side, don't mess with the console!"
        };
    }
}

function validateTypeOfOutgoingMsg(data) {
    try {
        const stringifiedData = stringifyJson(data);
        const msgType = data.type
        switch (msgType) {
            case "chatMsg":
                return stringifiedData;
            case "botMsg":
                return stringifiedData;
            case "imageMsg":
                return stringifiedData;
            case "status":
                return stringifiedData;
            default:
                throw "ERROR type problem!";
        }
    } catch (err) {
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