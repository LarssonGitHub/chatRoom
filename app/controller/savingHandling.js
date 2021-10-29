import {
    saveChatToDatabase
} from "../models/chatModel.js";

async function prepareChatSaving(dataObj) {
    try {
        const couldSaveChat = await saveChatToDatabase(dataObj);
        if (!couldSaveChat) {
            throw "The chat message didn't save.";
        }
        return couldSaveChat;
    } catch (err) {
        console.log(err, "14");
        return Promise.reject(err);
    }
}

export {
    prepareChatSaving
}