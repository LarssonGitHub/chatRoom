import {
    parseJson,
    stringifyJson
} from '../library/functions.js'

function validateTypeOfIncomingMessage(data) {
    const parsedData = parseJson(data)
    const msgType = parsedData.type
    switch (msgType) {
        case "chatMsg":
            return parsedData;
        case "botMsg":
            return parsedData;
        case "imageChatMsg":
        case "status":
            return parsedData;
        default:
            // Remember to send back to client that their message and type wasn't approved.....
            console.log("error... Something went horrible wrong when handling incoming...!");
            return {err: "error....!"}
}}


function validateTypeOfOutgoingMessage(data) {
    const msgType = data.type
    switch (msgType) {
        // TODO Find better names
        case "chatMsg":
            console.log("it's a chat! Do something with it", data);
            return stringifyJson(data);
        case "botMsg":
            console.log("it's a bot SERVER! Do something with it", data);
            return stringifyJson(data);
        case "imageChatMsg":
            console.log("it's an image! Do something with it", data);
        case "status":
            console.log("it's a status SERVER! Do something with it", data);
            return stringifyJson(data);
        default:
            // Remember to send back to client that their message and type wasn't approved.....
            console.log("error... Something went horrible wrong here...!");
            return {err: "error....!"}
    }
}



export {
    validateTypeOfOutgoingMessage,
    validateTypeOfIncomingMessage
}