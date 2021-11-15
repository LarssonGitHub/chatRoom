const websocket = new WebSocket("ws://localhost:8999");

// To make it work with heroku.
// var HOST = location.origin.replace(/^http/, 'ws')
// const websocket = new WebSocket(HOST);

function sortTargetOfStatusMsg(msg) {
    switch (msg.target) {
        case "clientInteger":
            displayNumberOfClientsOnline(msg);
            break;
        case "clientArray":
            displayListOfClientsNamesOnline(msg);
            break;
        default:
            const errorMsg = "something went wrong when sorting a target message from websocket!"
            displayEmanageErrorAndAppendToPopupBoxrrorMsg(errorMsg)
            break;
    }
}

function sortTypeOfReceivedMsg(msg) {
    switch (msg.type) {
        case "chatMsg":
            displayChatMsg(msg);
            break;
        case "botMsg":
            displayChatMsg(msg);
            break;
        case "imageMsg":
            displayImageMsg(msg);
            break;
        case "status":
            sortTargetOfStatusMsg(msg)
            break;
        case "errorMsg":
            displayChatMsg(msg);
            break;
        default:
            const errorMsg = "something went wrong when sorting a received message from websocket!"
            manageErrorAndAppendToPopupBox(errorMsg)
            break;
    }
}

function sendMsgToWebsocket(data) {
    console.log(data, "sending data to websocket");
    const stringifiedData = stringifyJson(data)
    websocket.send(stringifiedData);
}

websocket.addEventListener("message", (event) => {
    console.log(event.data);
    const parsedData = parseJson(event.data);
    
    // easter egg check!
    // easterEggIsActivated(parsedData.data)
    if (!clientLookingAtBrowserWindow) {
    notifyNewMessage()
    }
    sortTypeOfReceivedMsg(parsedData)
})

websocket.addEventListener('close', (event) => {
    console.log('Server down...', event);
    manageErrorAndAppendToPopupBox("Sorry, the server shut down, either from timeout or something going wrong with your validation, redirecting to login.");
    location.assign("/login");
});