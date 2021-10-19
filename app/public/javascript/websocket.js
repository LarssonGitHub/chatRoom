const websocket = new WebSocket("ws://localhost:8999");

function displayErrorMessage() {
    console.log("error....!");
}

function sortTargetOfStatusMessage(msh) {
    // Use for later
}

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
                    displayErrorMessage()
                    break;
            }
            break;
        default:
            displayErrorMessage()
            break;
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