import {
    Gallery,
} from "./gallerySchema.js"

// TODO fix the wsID problem
async function saveImgToDatabase({imageMsg, user}, wsId) {
    try {
        // TODO this is dangerous, fix and do something else with base64!
        const galleryObj = new Gallery({
            base64: imageMsg,
            user: user
        });
        let success = await galleryObj.save();

        if (success) {
            console.log("img saved!");
        }
    } catch (err) {
        console.log("image didn't save!");
        console.log(err);
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