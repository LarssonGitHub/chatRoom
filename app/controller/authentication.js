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

async function loginUser(userName, userPassword) {
    try {
        const user = await checkForUser(userName, userPassword);
        if (user === "success") {
            return "success";
        }
    } catch (err) {
        console.log(err);
        return "failure"
    }
  
}

export {
    registerNewUser,
    loginUser
}