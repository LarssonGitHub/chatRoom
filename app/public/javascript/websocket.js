const websocket = new WebSocket("ws://localhost:8999");

function sortTypeOfReceivedMessage(msg) {
    console.log(msg);
    switch (msg.type) {
        // TODO Find better names
        case "chatMsg":
            console.log("it's a chat! Do something with it", msg);
            displayClientChatMsg(msg);
            break;
        case "botMsg":
            console.log("it's a botMsg! Do something with it", msg);
            displayBotChatMsg(msg);
            break;
        case "imageMsg":
            console.log("it's an image! Do something with it", msg);
            displayImageMsg(msg);
            break;
        case "status":
            switch (msg.target) {
                case "clientInteger":
                    displayNumberOfClientsOnline(msg);
                    break;
                case "clientArray":
                    displayListOfClientsNamesOnline(msg);
                    break;
                default:
                    break;
            }
            break;
        default:
            console.log("error....!");
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