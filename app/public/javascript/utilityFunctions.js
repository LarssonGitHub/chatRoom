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