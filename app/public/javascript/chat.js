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
const loadPreChatBtn = document.getElementById("loadPreChatBtn");

let paginationIntegerForChat = 0;

function displayListOfClientsNamesOnline({data}) {
    ListOfClients.textContent = "";
    data.forEach(userName => {
        let getTemplateHTML = document.importNode(clientsOnlineTemplate.content, true)
        getTemplateHTML.querySelector(".usernamesOnline").textContent = userName || "ERROR";
        ListOfClients.append(getTemplateHTML);
    })
}

function manageChatTemplate({type, user, data, time, imgData}) {
    let getTemplateHTML = document.importNode(chatTemplate.content, true)
    getTemplateHTML.querySelector(".chatTemplateContainer").classList.add(type === "botMsg" || type ===  "errorMsg" ? "botChatContainer" : "clientChatContainer");
    getTemplateHTML.querySelector(".clientName").textContent = user || "ERROR";
    getTemplateHTML.querySelector(".clientMsg").textContent = data || "ERROR";
    getTemplateHTML.querySelector(".clientTime").textContent = time || "ERROR";
    if (type === "imageMsg" && imgData.includes("data:image/png;")) {
        getTemplateHTML.querySelector(".clientImg").src = imgData;
        getTemplateHTML.querySelector(".clientImg").classList.toggle("hidden")
    }
    if (type === "imageMsg" && !imgData.includes("data:image/png;")) {
        getTemplateHTML.querySelector(".clientImg").src = "#####";
        getTemplateHTML.querySelector(".clientImg").alt = imgData;
        getTemplateHTML.querySelector(".clientImg").classList.toggle("hidden")
    }
    return getTemplateHTML;
}

function manageAndAppendToChatContainerTop(chatHistoryObjects) {
    chatHistoryObjects.forEach(chatMessage => {
    const chatDataSorted = manageChatTemplate(chatMessage);
    chatContainer.insertBefore(chatDataSorted, chatContainer.childNodes[2]);
    // chatContainer.prepend(chatDataSorted);
    });
}

function manageAndAppendToChatContainerBottom(chatObject) {
    const chatDataSorted = manageChatTemplate(chatObject);
    chatContainer.append(chatDataSorted);
    paginationIntegerForChat += 1;
    chatScrolling()
}

// TODO...! Fix so it only scrolls down when the user is at the bottom.
function chatScrolling() {
    chatContainer.scrollTop = chatContainer.scrollHeight;
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
    manageAndAppendToChatContainerBottom(chatObject)
}

function displayImageMsg(chatObject) {
    manageAndAppendToChatContainerBottom(chatObject)
}

function checkIfImgOrRegularChatObject(chatValue) {
    if (binaryCanvasValue) {
        return constructMsgObject("imageMsg", tempClientUserName, chatValue, binaryCanvasValue, saveToDatabase);
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

function fetchPreviousChat() {
    
fetch(`/chatHistory/${paginationIntegerForChat}`)
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            paginationIntegerForChat += 15;
            manageAndAppendToChatContainerTop(data.message);
          }
        if (data.err) {
            throw data.err;
        }
    }).catch((err) => {
        manageErrorAndAppendToPopupBox(err)
    });
}

loadPreChatBtn.addEventListener("click", fetchPreviousChat)
typingContainer.addEventListener("keydown", sendChatMsgToServer);
msgImgInputRemove.addEventListener("click", removeImgFromTypingContainer)