import {
    Gallery,
} from "../models/gallerySchema.js"
import {
    Users,
} from "../models/usersSchema.js"
import {
    v4 as uuidv4
} from 'uuid';

async function addNewUser(userName, userPassword) {
    try {
        const newUser = new Users({
            userName: userName,
            userPassword: userPassword,
            userStatus: "offline",
            tempWebsocketId: false
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
            userStatus: "offline",
            tempWebsocketId: false
        });
        if (!userExist) {
            throw "No user like that exist D:";
        }
        return userExist;
    } catch (err) {
        console.log("use doesn't exist!");
        console.log(err);
        return "failure"
    }
}

async function getUserName(wsID) {
    return await Users.findById(wsID)
}

async function setIdAndStatusForWebsocket({_id}) {
    try {
        const updateUser = await Users.findByIdAndUpdate(_id, {
            userStatus: "online",
            tempWebsocketId: _id
        }, {
            new: true
        });
        
        if (!updateUser) {
            throw "Something went wrong";
        }
        return updateUser;
    } catch (err) {
        console.log("use doesn't exist!");
        console.log(err);
        return "failure"
    }
}

async function removeIdAndStatusForWebsocket() {
    try {
        const updateUser = await Users.updateOne({
            userName: userName,
            userPassword: userPassword,
            userStatus: "offline",
            tempWebsocketId: false
        });
        if (!updateUser) {
            throw "Something went wrong";
        }
        return userExist;
    } catch (err) {
        console.log("user doesn't exist!");
        console.log(err);
        return "failure"
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
    getUserName,
    setIdAndStatusForWebsocket,
    removeIdAndStatusForWebsocket,
    saveImgToDatabase,
    getCollectionOfGallery
}