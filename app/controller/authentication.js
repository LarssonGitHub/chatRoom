import {
    addNewUser,
    checkForUser,
    getAllUsers
} from "../models/userModel.js";


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
        console.log(err);
        return Promise.reject(err);
    }
}

// TODO This is stupid! 
async function loginUser(userName, userPassword) {
        return await checkForUser(userName, userPassword);
}

export {
    registerNewUser,
    loginUser,
}