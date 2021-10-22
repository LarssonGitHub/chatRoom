import {
    getUserName
} from "./messageHandling.js"
import {
    saveImgToDatabase
} from "../models/galleryModel.js"

async function prepareImageSaving(parsedData, wsId) {
    try {
        const usernameExist = await getUserName(wsId);
        if (!usernameExist) {
            throw "Something went wrong when saving your username and image";
        }
        const couldSaveImg = await saveImgToDatabase(parsedData, usernameExist);
        if (!couldSaveImg) {
            throw "Your image couldn't be saved to the database.";
        }
        console.log("yay, saved!", couldSaveImg);
        return parsedData;
    } catch (err) {
        return Promise.reject(err);
    }
}

export {
    prepareImageSaving
}