import {
    addNewUser,
    checkForUser
} from "./database.js"

async function registerNewUser(userName, userPassword) {
    try {
        const newUser = await addNewUser(userName, userPassword);
        if (newUser === "success") {
            return "success";
        }
    } catch (err) {
        console.log(err);
        return "failure"
    }
}

// TODO This is stupid! 
async function loginUser(userName, userPassword) {
        return await checkForUser(userName, userPassword);
}

export {
    registerNewUser,
    loginUser
}