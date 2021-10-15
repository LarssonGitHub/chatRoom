import {
    Gallery,
} from "../models/gallerySchema.js"
import {
    Users,
} from "../models/usersSchema.js"

async function addNewUser(userName, userPassword) {
    try {
        const newUser = new Users({
            userName: userName,
            userPassword: userPassword,
            userStatus: "offline"
        });
        // TODO check if user already exist + error handling.
        let success = await newUser.save();
        if (success) {
            return "success"
        }
    } catch (err) {
        console.log("user didn't save!");
        console.log(err);
    }
}

async function checkForUser(userName, userPassword) {
    try {
        const userExist = await Users.findOne({
            userName: userName,
            userPassword: userPassword,
            userStatus: "offline"
        });
        if (!userExist) {
            throw "No user like that exist D:";
        }
        return "success"
    } catch (err) {
        console.log("user didn't save!");
        console.log(err);
    }
}

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
    addNewUser,
    checkForUser,
    saveImgToDatabase,
    getCollectionOfGallery
}