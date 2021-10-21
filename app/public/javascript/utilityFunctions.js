function parseJson(data) {
    try {
        return JSON.parse(data)
    } catch (err) {
        // TODO: error handling.. Send back the err
        console.log("Something went wrong..", err);
        return
    }
}

function stringifyJson(data) {
    try {
        return JSON.stringify(data)
    } catch (err) {
        // TODO: error handling.. Send back the err
        console.log("Something went wrong..", err);
        return
    }
}

function ObjectifyEntriesAndStringify(data) {
    const formData = new FormData(data);
    return JSON.stringify(Object.fromEntries(formData))
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
        msgTemplate.imgData = binaryCanvasValue;
    }
    return msgTemplate;
}