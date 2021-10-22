const websocket = new WebSocket("ws://localhost:8999");

function sortTargetOfStatusMsg(msg) {
    switch (msg.target) {
        case "clientInteger":
            displayNumberOfClientsOnline(msg);
            break;
        case "clientArray":
            displayListOfClientsNamesOnline(msg);
            break;
        default:
            const errorMsg = "something went wrong when sorting a target message from websocket! (Only you can see this!)"
            displayErrorMsg(errorMsg)
            break;
    }
}

function sortTypeOfReceivedMsg(msg) {
    switch (msg.type) {
        case "chatMsg":
            displayClientChatMsg(msg);
            break;
        case "botMsg":
            displayBotChatMsg(msg);
            break;
        case "imageMsg":
            displayImageMsg(msg);
            break;
        case "status":
            sortTargetOfStatusMsg(msg)
            break
        default:
            const errorMsg = "something went wrong when sorting a received message from websocket! (Only you can see this!)"
            displayErrorMsg(errorMsg)
            break;
    }
}

function sendMsgToWebsocket(data) {
    const stringifiedData = stringifyJson(data)
    websocket.send(stringifiedData);
}

websocket.addEventListener("message", (event) => {
    const parsedData = parseJson(event.data);
    sortTypeOfReceivedMsg(parsedData)
})

websocket.addEventListener('close', (event) => {
    console.log('Server down...', event);
});