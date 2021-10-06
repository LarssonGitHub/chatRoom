function parseJson(data) {
    try {
        return JSON.parse(data)
    } catch(err) {
        // TODO: error handling.. Send back the err
        console.log("Something went wrong..", err);
        return
    }
}

function stringifyJson(data) {
    try {
        return JSON.stringify(data)
    } catch(err) {
        // TODO: error handling.. Send back the err
        console.log("Something went wrong..", err);
        return
    }
}

export {
    parseJson,
    stringifyJson
}