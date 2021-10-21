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
function manageAndAppendToChatContainer(type, user, data, time, img) {
    let getHTML = document.importNode(chatTemplate.content, true)
    getHTML.querySelector(".chatTemplateContainer").classList.add(type === "botMsg" ? "botChatContainer" : "clientChatContainer");
    getHTML.querySelector(".clientName").textContent = user || "ERROR";
    getHTML.querySelector(".clientMsg").textContent = data || "ERROR";
    getHTML.querySelector(".clientTime").textContent = time || "ERROR";
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
    console.log(chatObject);
    const {
        type,
        user,
        data,
        time
    } = chatObject;
    manageAndAppendToChatContainer(type, user, data, time)
}

// TODO debate if bot and client needs their own types....?!?!
function displayBotChatMsg(chatObject) {
    console.log("the boooot", chatObject);
    const {
        type,
        user,
        data,
        time
    } = chatObject;
    manageAndAppendToChatContainer(type, user, data, time)
}

function displayImageMsg(chatObject) {
    console.log("the iimmmmage", chatObject);
    console.log("this should work,", chatObject);
    // TODO add an alt tag..!
    const {
        type,
        user,
        data,
        time,
        imgData
    } = chatObject;
    manageAndAppendToChatContainer(type, user, data, time, imgData)
}

// TODO This should be sent to server.. By session or cookies and stuff....
let clientUserName = "tempNickname"

function sendChatMsgToServer(e) {
    let chatValue = chatTextarea.value
    if ((e.code === "Enter" && !e.shiftKey) && chatValue.length > 0) {
        // TODO Find another way to check what type of msg CLIENT makes the msg!!!!!!!!!!!
        let constructedMsg
        if (binaryCanvasValue) {
            constructedMsg = constructMsgObject("imageMsg", clientUserName, chatValue, binaryCanvasValue);
            chatTextarea.value = "";
            binaryCanvasValue = "";
            checkIfTypingImgShouldHidden();
        } else {
            constructedMsg = constructMsgObject("chatMsg", clientUserName, chatValue);
        }
        sendMsgToWebsocket(constructedMsg);
        // TODO Fix so textarea doesn't start on a new line.. When clearing...
        chatTextarea.value = "";
    }
}

typingContainer.addEventListener("keydown", sendChatMsgToServer);
msgImgInputRemove.addEventListener("click", removeImgFromTypingContainer)