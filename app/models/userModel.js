import {
    Users,
} from "./usersSchema.js"

async function resetDatabaseStatus() {
    try {
        const updateUsers = await Users.updateMany({}, {
            userStatus: "offline",
            tempWebsocketId: false
        })
        if (!updateUsers) {
            throw "No users exist";
        }
        return updateUsers;
    } catch (err) {
        return Promise.reject(err);
    }
}

async function getAllUsers() {
    try {
        const arrayOfAllUsers = await Users.find({});
        if (!arrayOfAllUsers || arrayOfAllUsers.length === 0) {
            throw "No users exist";
        }
        return arrayOfAllUsers;
    } catch (err) {
        return Promise.reject(err);
    }
}

async function resetDatabaseUsers() {
    try {
        await resetDatabaseStatus()
        console.log("All users rested!");
    } catch (err) {
        console.log(err);
        console.log("Something Went wrong when resetting database!");
    }
}

async function addNewUser(userName, userPassword) {
    try {
        const newUser = new Users({
            userName: userName,
            userPassword: userPassword,
            userStatus: "offline",
            tempWebsocketId: false
        });
        let success = await newUser.save();
        if (success) {
            return true
        }
        throw "Something went wrong when saving user"
    } catch (err) {
        return Promise.reject(err);
    }
}

async function checkForUser(userName, userPassword) {
    try {
        const userExist = await Users.findOne({
            userName: userName,
            userPassword: userPassword,
        });
        if (!userExist) {
            throw "Your password or username is incorrect";
        }
        return userExist;
    } catch (err) {
        console.log(err);
        return Promise.reject(err);
    }
}

async function getUser(wsID) {
    try {
        const userObject = await Users.findById(wsID);
        return userObject;
    } catch (err) {
        console.log(err);
        return Promise.reject(err);
    }
}

async function setIdAndStatusForWebsocket({
    _id
}) {
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
        console.log("userStats put to online!");
        return updateUser;
    } catch (err) {
        console.log("use doesn't exist!");
        console.log(err);
        return Promise.reject(err);
    }
}

async function removeIdAndStatusForWebsocket(id) {
    try {
        const updateUser = await Users.findByIdAndUpdate(id, {
            userStatus: "offline",
            tempWebsocketId: false
        }, {
            new: true
        })
        if (!updateUser) {
            throw "Something went wrong";
        }
        console.log("in the model", updateUser);
        return updateUser;
    } catch (err) {
        console.log(err);
        return Promise.reject(err);
    }
}

async function getUsersOnline() {
    try {
        const arrayOfUsersOnline = await Users.find({
            userStatus: "online"
        });
        if (!arrayOfUsersOnline) {
            throw "Something went wrong";
        }
        console.log("right now this are online", arrayOfUsersOnline);
        return arrayOfUsersOnline;
    } catch (err) {
        console.log("user doesn't exist!");
        console.log(err);
        return Promise.reject(err);
    }
}

export {
    resetDatabaseUsers,
    getAllUsers,
    addNewUser,
    checkForUser,
    getUser,
    setIdAndStatusForWebsocket,
    removeIdAndStatusForWebsocket,
    getUsersOnline
}