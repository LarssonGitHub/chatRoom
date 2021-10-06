const clientsOnline = document.getElementById('clientsOnline');
const chatContainer = document.getElementById('chatContainer');
const chatTemplate = document.getElementById('chatTemplate');
const enterChatBtn = document.getElementById("enterChatBtn");
const chatWindow = document.getElementById("chatWindow");
const chatTextarea = document.getElementById("chatTextarea");

function displayNumberOfClientsOnline(object) {
    const {type, data} = object
    clientsOnline.textContent = data
}

function manageAndAppendToChatContainer(object) {
    const {type, user, data} = object;
    let getHTML = document.importNode(chatTemplate.content, true)
    getHTML.querySelector(".clientName").textContent = user || "ERROR";
    getHTML.querySelector(".clientMsg").textContent = data  || "ERROR";
    // TODO: Adding a class.... Does we need two types?!?! As stated bellow
    getHTML.querySelector(".chatTemplateContainer").classList.add(type === "botMsg" ? "botChatContainer" :  "clientChatContainer")
    chatContainer.append(getHTML)
}

function displayClientChatMsg(object) {
    manageAndAppendToChatContainer(object)
}

// TODO debate if bot and client needs their own types....?!?!
function displayBotChatMsg(object) {
    manageAndAppendToChatContainer(object)
}

// TODO This should be sent to server.. By session or cookies and stuff....
let clientUserName = "No nickname Given"

function validateNewUser() {
    const userName = document.getElementById("userName");
    if (userName.value.length > 2) {
        userName.setAttribute("disabled", "disabled");
        enterChatBtn.classList.toggle("hidden");
        userName.classList.toggle("hidden");
        clientUserName = userName.value;
        chatWindow.classList.toggle("hidden");
        chatTextarea.focus();
        return;
    }
    alert("You didn't validate :(")
}

function addMessage(type, user, chatData) {
    // Validate here..... Try catch? .....
    return {
        type: type,
        user: user,
        data: chatData
    }
}

function sendChatMsgToServer(e) {
    let chatValue = chatTextarea.value
    if ((e.code === "Enter" && !e.shiftKey) && chatValue.length > 0) {
        let constructedMsg = addMessage("chatMsg", clientUserName, chatValue);
        displayClientChatMsg(constructedMsg);
        sendMsgToWebsocket(constructedMsg);
        // TODO Fix so textarea doesn't start on a new line.. When clearing...
        chatTextarea.value = ""
}}

enterChatBtn.addEventListener("click", validateNewUser);
chatWindow.addEventListener("keydown", sendChatMsgToServer);