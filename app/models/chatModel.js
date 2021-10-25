import {
    Chat,
} from "./chatSchema.js"

async function saveChatToDatabase({
    type, user, data, imgData, time, save
}) {
    try {
        const chatObj = new Chat({
            type: type, 
            user: user, 
            data: data, 
            imgData: save ? imgData : "", 
            time: time
        });
        let success = await chatObj.save();
        if (success) {
            success.imgData = imgData || "";
            return success
        }
        throw "Not sure what went wrong, but your post couldn't be saved, this is on our end!!"
    } catch (err) {
        console.log("post didn't save!", err);
        return Promise.reject("Not sure what went wrong, but your post couldn't be saved!");
    }
}

export {
    saveChatToDatabase
}