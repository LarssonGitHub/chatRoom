import {
    Gallery
} from "../models/gallerySchema.js"

async function saveImgToDatabase(obj) {
    // https://www.youtube.com/watch?v=WDrU305J1yw&ab_channel=Academind
    // Debate how to error handling, like this guy!
    try {
        // TODO this is dangerous, fix and do something else with base64!
        const galleryObj = new Gallery({
            base64: obj.imageMsg,
            user: obj.user
        });
        let success = await galleryObj.save();

        if (success) {
            // TODO fix this by letting user know if it was saved or not!
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
        return err
        }
    }


export {
    saveImgToDatabase,
    getCollectionOfGallery
}