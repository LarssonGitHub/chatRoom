import {
    addNewUser,
    checkForUser,
    getAllUsers
} from "../models/userModel.js";

// This array is needed to make sure websocket id is set correctly.
let usersInTempMemory = [];

async function checkIfUserAlreadyExist(newUsername) {
    const users = await getAllUsers();
    const checkUsername = users.filter(user => user.userName === newUsername);
    if (checkUsername.length > 0) {
        return true
    }
    return false
}

async function registerNewUser(userName, userPassword) {
    try {
        const userAlreadyExist = await checkIfUserAlreadyExist(userName);
        if (userAlreadyExist) {
            throw "Sorry, user already exist. Pick another name"
        }
        const userCanBeAdded = await addNewUser(userName, userPassword);
        if (!userCanBeAdded) {
            throw "Something went wrong in registering process"
        }
        return true;
    } catch (err) {
        console.log(err, "36");
        return Promise.reject(err);
    }
}

async function loginUser(userName, userPassword) {
    try {
        const userExist = await checkForUser(userName, userPassword);
        if (userExist) {
            return userExist;
        }
        throw "something went wrong on our end when checking for users"
    } catch (err) {
        console.log(err, "35");
        return Promise.reject(err);
    }

}

export {
    registerNewUser,
    loginUser,
    usersInTempMemory
}