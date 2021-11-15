const errorContainer = document.getElementById("errorContainer");
const errorText = document.getElementById("errorText");
const closeErrorContainer = document.getElementById("closeErrorContainer");

// Lets the script know if user is looking at screen or not, as well as a fallback for off-canvas.
let clientLookingAtBrowserWindow = true;
let offCanvasIsActive = false;

function hideElement(element) {
    element.classList.toggle("hidden");
}

// Unused function...
// function disableElement(element) {
//     console.log(element);
//     const elementIsDisabled = element.disabled;
//     console.log(elementIsDisabled);
//     if (elementIsDisabled) {
//         element.disabled = false;
//         return;
//     }
//     element.disabled = true;;
// }

function displayOfCanvas(element) {
    element.classList.toggle("displayOfCanvas");
}

function activeElement(element) {
    element.classList.toggle("activeBtn");
}

function manageErrorAndAppendToPopupBox(err) {
    errorText.textContent = err;
    errorContainer.classList.toggle("hidden")
}

function closeErrorPopupBox() {
    errorText.textContent = "";
    errorContainer.classList.toggle("hidden")
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

closeErrorContainer.addEventListener("click", closeErrorPopupBox)