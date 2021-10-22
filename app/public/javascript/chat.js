const clientsOnline = document.getElementById('clientsOnline');
const chatContainer = document.getElementById('chatContainer');
const chatTemplate = document.getElementById('chatTemplate');
const clientsOnlineTemplate = document.getElementById("clientsOnlineTemplate")
const typingContainer = document.getElementById("typingContainer");
const chatTextarea = document.getElementById("chatTextarea");
const imgImgContainer = document.getElementById("imgImgContainer");
const msgImgInputRemove = document.getElementById("msgImgInputRemove");
const ListOfClients = document.getElementById("ListOfClients");
const msgImgInput = document.getElementById("msgImgInput");





// TODO THIS MANGLE NEEDS TO BE CORRECTED! IT WORKS, BUT DAMN.
// Caan't get this to work!
function displayListOfClientsNamesOnline({
    data
}) {
    let getTemplateHTML = document.importNode(clientsOnlineTemplate.content, true);
    let templateChild = getTemplateHTML.querySelector(".usernamesOnline");
    for (clientName of data) {
        templateChild.textContent = clientName || "ERROR";
        getTemplateHTML.append(templateChild);
    }
    ListOfClients.append(getTemplateHTML);
}

// TODO find a better way to write this whole damn chat template..:!
function manageAndAppendToChatContainer(type, user, data, time, img) {
    let getTemplateHTML = document.importNode(chatTemplate.content, true)
    getTemplateHTML.querySelector(".chatTemplateContainer").classList.add(type === "botMsg" ? "botChatContainer" : "clientChatContainer");
    getTemplateHTML.querySelector(".clientName").textContent = user || "ERROR";
    getTemplateHTML.querySelector(".clientMsg").textContent = data || "ERROR";
    getTemplateHTML.querySelector(".clientTime").textContent = time || "ERROR";
    console.log(type, user, data, img);
    if (type === "imageMsg" && img) {
        // TODO find a better way to write this whole damn chat template..:!
        getTemplateHTML.querySelector(".clientImg").src = img;
        getTemplateHTML.querySelector(".clientImg").classList.toggle("hidden")
    }
    // TODO: Adding a class.... Does we need two types?!?! As stated bellow
    chatContainer.append(getTemplateHTML);
}




function displayNumberOfClientsOnline({
    data
}) {
    clientsOnline.textContent = data
}

function checkIfTypingImgShouldHidden() {
    if (!binaryCanvasValue) {
        hideElement(imgImgContainer)
    }
}

function removeImgFromTypingContainer() {
    resetBinaryCanvasValue()
    msgImgInput.src = ""
    checkIfTypingImgShouldHidden()
}

function appendToTypingContainer(dataURL) {
    msgImgInput.src = dataURL
}

function displayChatMsg(chatObject) {
    const {
        type,
        user,
        data,
        time
    } = chatObject;
    manageAndAppendToChatContainer(type, user, data, time)
}

function displayImageMsg(chatObject) {
    const {
        type,
        user,
        data,
        time,
        imgData
    } = chatObject;
    manageAndAppendToChatContainer(type, user, data, time, imgData)
}

function checkIfImgOrRegularChatObject(chatValue) {
    if (binaryCanvasValue) {
        return constructMsgObject("imageMsg", tempClientUserName, chatValue, binaryCanvasValue);
    } else {
        return constructMsgObject("chatMsg", tempClientUserName, chatValue);
    }
}

// This var sets a temp nickname which is replaced by the user's database nickname once it's send to the websocket.
let tempClientUserName = "tempNickname"

function sendChatMsgToServer(e) {
    let chatValue = chatTextarea.value
    if ((e.code === "Enter" && !e.shiftKey) && chatValue.length > 0) {
        e.preventDefault()
        let constructedMsg = checkIfImgOrRegularChatObject(chatValue);
        sendMsgToWebsocket(constructedMsg);
        chatTextarea.value = "";
    }
}

typingContainer.addEventListener("keydown", sendChatMsgToServer);
msgImgInputRemove.addEventListener("click", removeImgFromTypingContainer)