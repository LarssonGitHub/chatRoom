const clientsOnline = document.getElementById('clientsOnline');
const chatContainer = document.getElementById('chatContainer');
const chatTemplate = document.getElementById('chatTemplate');
const typingContainer = document.getElementById("typingContainer");
const chatTextarea = document.getElementById("chatTextarea");
const imgImgContainer = document.getElementById("imgImgContainer");
const msgImgInputRemove = document.getElementById("msgImgInputRemove")
const ListOfClients = document.getElementById("ListOfClients");

function displayListOfClientsNamesOnline({data}) {
    ListOfClients.innerHTML = '';
    data.forEach(client => {
    const li = document.createElement('li');
    li.innerText = client;
    ListOfClients.appendChild(li);
    });
}

function displayNumberOfClientsOnline({data}) {
    clientsOnline.textContent = data
}

function checkIfTypingImgShouldHidden() {
    if (!binaryCanvasValue) {
        imgImgContainer.classList.toggle("hidden")
    }
}

function appendToTypingContainer(dataURL) {
    // TODO make a separate function to hide and show shit.
    const msgImgInput = document.getElementById("msgImgInput");
    msgImgInput.src = dataURL
}

function removeImgFromTypingContainer() {
    binaryCanvasValue = "";
    checkIfTypingImgShouldHidden()
}

// TODO find a better way to write this whole damn chat template..:!
function manageAndAppendToChatContainer(type, user, data, img) {
    let getHTML = document.importNode(chatTemplate.content, true)
    getHTML.querySelector(".chatTemplateContainer").classList.add(type === "botMsg" ? "botChatContainer" : "clientChatContainer");
    getHTML.querySelector(".clientName").textContent = user || "ERROR";
    getHTML.querySelector(".clientMsg").textContent = data || "ERROR";
    console.log(type, user, data, img);
    if (type === "imageMsg" && img) {
        // TODO find a better way to write this whole damn chat template..:!
        getHTML.querySelector(".clientImg").src = img;
        getHTML.querySelector(".clientImg").classList.toggle("hidden")
    }
    // TODO: Adding a class.... Does we need two types?!?! As stated bellow
    chatContainer.append(getHTML);
}

function displayClientChatMsg(chatObject) {
    const {
        type,
        user,
        data
    } = chatObject;
    manageAndAppendToChatContainer(type, user, data)
}

// TODO debate if bot and client needs their own types....?!?!
function displayBotChatMsg(chatObject) {
    const {
        type,
        user,
        data
    } = chatObject;
    manageAndAppendToChatContainer(type, user, data)
}

function displayImageMsg(chatObject) {
    console.log("this should work,", chatObject);
    // TODO add an alt tag..!
    const {
        type,
        user,
        data,
        imageMsg
    } = chatObject;
    manageAndAppendToChatContainer(type, user, data, imageMsg)
}

// TODO This should be sent to server.. By session or cookies and stuff....
let clientUserName = "No nickname Given"

function constructMsgObject(type, user, chatData, binaryCanvasValue) {
    // console.log(type, user, chatData, binaryCanvasValue);
    // Validate here..... Try catch? .....
    msgTemplate = {}

    // TODO Make into a switch?
    if (type) {
        msgTemplate.type = type;
    }
    if (user) {
        msgTemplate.user = user;
    }
    if (chatData) {
        msgTemplate.data = chatData;
    }
    if (binaryCanvasValue) {
        msgTemplate.imageMsg = binaryCanvasValue;
    }
    return msgTemplate;
}

function sendChatMsgToServer(e) {
    let chatValue = chatTextarea.value
    if ((e.code === "Enter" && !e.shiftKey) && chatValue.length > 0) {
        // TODO Find another way to check what type of msg CLIENT makes the msg!!!!!!!!!!!
        let constructedMsg
        if (binaryCanvasValue) {
            constructedMsg = constructMsgObject("imageMsg", clientUserName, chatValue, binaryCanvasValue);
            displayImageMsg(constructedMsg)
            chatTextarea.value = "";
            binaryCanvasValue = "";
            checkIfTypingImgShouldHidden();
        } else {
            constructedMsg = constructMsgObject("chatMsg", clientUserName, chatValue);
            displayClientChatMsg(constructedMsg);
        }
        sendMsgToWebsocket(constructedMsg);
        // TODO Fix so textarea doesn't start on a new line.. When clearing...
        chatTextarea.value = "";
    }
}

typingContainer.addEventListener("keydown", sendChatMsgToServer);
msgImgInputRemove.addEventListener("click", removeImgFromTypingContainer)