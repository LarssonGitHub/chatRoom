import {
    Gallery
} from "../models/gallerySchema.js"

async function saveImgToDatabase(obj) {
    console.log("this is an object", obj)
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

export {
    saveImgToDatabase
}