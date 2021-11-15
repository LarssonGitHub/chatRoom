import {
    Chat,
} from "./chatSchema.js"

async function saveChatToDatabase({
    type, user, data, imgData, time, save, postDate
}) {
    try {
        const chatObj = new Chat({
            type: type, 
            user: user, 
            data: data, 
            imgData: save ? imgData : "Image not saved by the user!", 
            time: time,
            postDate: postDate
        });
        let success = await chatObj.save();
        if (success) {
            success.imgData = imgData || "";
            return success
        }
        throw "Not sure what went wrong, but your post couldn't be saved, this is on our end!!"
    } catch (err) {
        console.log(err, "19");
        return Promise.reject("Not sure what went wrong, but your post couldn't be saved!");
    }
}

async function getCollectionOfGallery() {
    try {
        const listOfImages = await Chat.find({ imgData: { "$regex": "data:image/png"} });
        if (!listOfImages || listOfImages.length === 0) {
            throw "There sadly isn't any pictures posted online yet D:";
        }
        return listOfImages;
    } catch (err) {
        console.log(err, "20");
        return Promise.reject(err);
    }
}

async function getChatPagination(startIndex) {
    try {
        const chatResults = await Chat.find({}).sort({postDate: -1}).limit(15).skip(Number(startIndex));
        if (!chatResults || chatResults.length === 0) {
            throw "There sadly isn't any posts online yet D:";
        }
        return chatResults;
    } catch (err) {
        console.log(err, "21");
        return Promise.reject(err);
    }
}

export {
    saveChatToDatabase,
    getCollectionOfGallery,
    getChatPagination
}