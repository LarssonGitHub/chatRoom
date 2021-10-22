function manageErrorandAppendToPopupBox(err) {
    // TODO create a better feedback system...! At least it handles errors, but put it in a popup box! Bootstrap?
    alert(err);
}


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


function hideElement(element) {
    element.classList.toggle("hidden")
}

function parseJson(data) {
    return JSON.parse(data)
}

function stringifyJson(data) {
    return JSON.stringify(data)
}

function ObjectifyEntriesAndStringify(data) {
    const formData = new FormData(data);
    return stringifyJson(Object.fromEntries(formData))
}

function setFetchPostOptions(formEntries) {
    return {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: formEntries
    };
}

function constructMsgObject(type, user, chatData, binaryCanvasValue, saveToDatabase) {
    msgTemplate = {};
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
        msgTemplate.imgData = binaryCanvasValue;
        removeImgFromTypingContainer()
        cleanAllCanvas();
    }
    if (saveToDatabase) {
        msgTemplate.save = true;
    }
    return msgTemplate;
}

function displayErrorMsg(errorMsg) {
    // TODO put this as an error... Do something with it..!
    console.log(errorMsg);
}