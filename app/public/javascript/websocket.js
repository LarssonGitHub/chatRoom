const websocket = new WebSocket("ws://localhost:8999");

function sortTypeOfReceivedMessage(data) {
    const msgType = data.type
    console.log(msgType);
    switch (msgType) {
        // TODO Find better names
        case "chatMsg":
            console.log("it's a chat! Do something with it", data);
            displayClientChatMsg(data);
            break;
        case "botMsg":
            console.log("it's a botMsg! Do something with it", data);
            displayBotChatMsg(data);
            break;
        case "imageMsg":
            console.log("it's an image! Do something with it", data);
            displayImageMsg(data);
            break;
        case "status":
            console.log("it's a client note...! Do something with it", data);
            displayNumberOfClientsOnline(data);
            break;
        default:
            break;
    }
}

function parseJson(data) {
    try {
        return JSON.parse(data)
    } catch (err) {
        // TODO: error handling.. Send back the err
        console.log("Something went wrong..", err);
        return
    }
}

function stringifyJson(data) {
    try {
        return JSON.stringify(data)
    } catch (err) {
        // TODO: error handling.. Send back the err
        console.log("Something went wrong..", err);
        return
    }
}

function sendMsgToWebsocket(data) {
    const stringifiedData = stringifyJson(data)
    websocket.send(stringifiedData);
}

websocket.addEventListener("message", (event) => {
    const parsedData = parseJson(event.data);
    sortTypeOfReceivedMessage(parsedData)
})

websocket.addEventListener('close', (event) => {
    console.log('Server down...', event);
});