window.addEventListener('beforeunload', function (e) {
    e.preventDefault();
    e.returnValue = '';
});

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
const usersOnlineSection = document.getElementById("usersOnlineSection");
const closeUsersOnlineSection = document.getElementById("closeUsersOnlineSection");
const usersOnlineToggleBtn = document.getElementById("usersOnlineToggleBtn");
const sendToWebserverBtn = document.getElementById("sendToWebserverBtn");

let paginationIntegerForChat = 0;

let receivedMessageCount = 0;

function resetTitle() {
    document.title = "Draw n' Chat";
}

function editTitle() {
    ++receivedMessageCount
    document.title = `Draw n' Chat (${receivedMessageCount})`;
}

function playSound() {
    var audio = new Audio('/../assets/notfication.mp3');
    audio.play();

    // Implement if audio plays...
    // audio.pause();
    // audio.currentTime = 0;
}

//  Not implemented yet
function updateFavicon(incomingNewMsg) {
    if (incomingNewMsg) {

        console.log("favicon with dot added! Or it should");
        return;
    }
    console.log("favicon without dot added!");
}

function notifyNewMessage() {
    editTitle()
    playSound()
    updateFavicon(true)
}

function resetNewMessageNotifications() {
    resetTitle();
    receivedMessageCount = 0;
    updateFavicon(false);
}

function displayListOfClientsNamesOnline({
    data
}) {
    ListOfClients.textContent = "";
    data.forEach(userName => {
        let getTemplateHTML = document.importNode(clientsOnlineTemplate.content, true)
        getTemplateHTML.querySelector(".usernamesOnline").textContent = userName || "ERROR";
        ListOfClients.append(getTemplateHTML);
    })
}

function manageChatTemplate({
    type,
    user,
    data,
    time,
    imgData
}) {
    let getTemplateHTML = document.importNode(chatTemplate.content, true)
    getTemplateHTML.querySelector(".chatTemplateContainer").classList.add(type === "botMsg" || type === "errorMsg" ? "botChatContainer" : "clientChatContainer");
    getTemplateHTML.querySelector(".clientName").textContent = user || "ERROR";
    getTemplateHTML.querySelector(".clientMsg").textContent = data || getTemplateHTML.querySelector(".clientMsg").classList.toggle("hidden")
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

function validateKeydownForSendingMsg(e) {
    let chatValue = chatTextarea.value;
    if ((e.which === 13 && !e.shiftKey && chatValue.length > 0) || (e.which === 13 && !e.shiftKey && binaryCanvasValue)) {
        e.preventDefault()
        sendChatMsgToServer(chatValue)
    }
    return;
}

function validateClickForSendingMsg() {
    let chatValue = chatTextarea.value;
    if (chatValue.length > 0 || binaryCanvasValue) {
        sendChatMsgToServer(chatValue)
    }
    return;
}

function sendChatMsgToServer(chatValue) {
    let constructedMsg = checkIfImgOrRegularChatObject(chatValue);
    sendMsgToWebsocket(constructedMsg);
    chatTextarea.value = '';
}


function fetchPreviousChat() {
    loadPreChatBtn.disabled = true;
    fetch(`/chatHistory/${paginationIntegerForChat}`)
        .then(response => response.json())
        .then(data => {
            loadPreChatBtn.disabled = false;
            if (data.message) {
                paginationIntegerForChat += 15;
                manageAndAppendToChatContainerTop(data.message);
            }
            if (data.err) {
                throw data.err;
            }
        }).catch((err) => {
            console.log(err, "31");
            manageErrorAndAppendToPopupBox(err)
        });

}

loadPreChatBtn.addEventListener("click", fetchPreviousChat)
typingContainer.addEventListener("keydown", validateKeydownForSendingMsg);
sendToWebserverBtn.addEventListener("click", validateClickForSendingMsg);
msgImgInputRemove.addEventListener("click", removeImgFromTypingContainer)
usersOnlineToggleBtn.addEventListener("click", () => {
    clientLookingAtBrowserWindow ? clientLookingAtBrowserWindow = false : clientLookingAtBrowserWindow = true;
    offCanvasIsActive ? offCanvasIsActive = false : offCanvasIsActive = true
    displayOfCanvas(usersOnlineSection);
    activeElement(usersOnlineToggleBtn);
})
closeUsersOnlineSection.addEventListener("click", () => {
    // clientLookingAtBrowserWindow = true;
    !clientLookingAtBrowserWindow ? clientLookingAtBrowserWindow = true : clientLookingAtBrowserWindow = false;
    !offCanvasIsActive ? offCanvasIsActive = true : offCanvasIsActive = false
    resetNewMessageNotifications();
    displayOfCanvas(usersOnlineSection);
    activeElement(usersOnlineToggleBtn);
});

document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === 'visible') {
        if (offCanvasIsActive) {
            return;
        }
        clientLookingAtBrowserWindow = true;
        resetNewMessageNotifications();
        return
    }
    clientLookingAtBrowserWindow = false
});
