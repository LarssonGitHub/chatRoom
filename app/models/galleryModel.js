import {
    Gallery,
} from "./gallerySchema.js"

async function saveImgToDatabase(dataObj, userName) {
    try {
        const {
            imgData
        } = dataObj
        const galleryObj = new Gallery({
            base64: imgData,
            user: userName
        });
        let success = await galleryObj.save();
        if (success) {
            return true;
        }
        throw "Not sure what went wrong, but your image couldn't be saved!"
    } catch (err) {
        console.log("image didn't save!", err);
        return Promise.reject("Not sure what went wrong, but your image couldn't be saved!");
    }
}

async function getCollectionOfGallery() {
    try {
        const listOfImages = await Gallery.find({});
        if (!listOfImages || listOfImages.length === 0) {
            throw "There sadly isn't any pictures posted online yet D:";
        }
        return listOfImages;
    } catch (err) {
        console.log(err);
        return Promise.reject(err);
    }
}

export {
    saveImgToDatabase,
    getCollectionOfGallery
}