// import {
//     Gallery,
// } from "../models/gallerySchema.js"
// import {
//     Users,
// } from "../models/usersSchema.js"

// async function resetDatabaseStatus() {
//     try {
//         const updateUsers = await Users.updateMany({}, {
//             userStatus: "offline",
//             tempWebsocketId: false
//         })
//         if (!updateUsers) {
//             throw "No users exist";
//         }
//         return updateUsers;
//     } catch (err) {
//         return Promise.reject(err);
//     }

// }
// async function resetDatabaseUsers() {
//     try {
//         await resetDatabaseStatus()
//         console.log("All users rested!");
//     } catch (err) {
//         console.log(err);
//         console.log("Something Went wrong when resetting database!");
//     }
// }

// async function getAllUsers() {
//     try {
//         const arrayOfAllUsers = await Users.find({});
//         if (!arrayOfAllUsers || arrayOfAllUsers.length === 0) {
//             throw "No users exist";
//         }
//         return arrayOfAllUsers;
//     } catch (err) {
//         return Promise.reject(err);
//     }
// }
// async function addNewUser(userName, userPassword) {
//     try {
//         const newUser = new Users({
//             userName: userName,
//             userPassword: userPassword,
//             userStatus: "offline",
//             tempWebsocketId: false
//         });
//         // TODO check if user already exist + error handling.
//         let success = await newUser.save();
//         if (success) {
//             return "success"
//         }
//     } catch (err) {
//         console.log("user didn't save!");
//         console.log(err);
//     }
// }

// async function checkForUser(userName, userPassword) {
//     try {
//         const userExist = await Users.findOne({
//             userName: userName,
//             userPassword: userPassword,
//         });
//         console.log(userExist);
//         if (!userExist) {
//             throw "No user like that exist D:";
//         }
//         return userExist;
//     } catch (err) {
//         console.log("use doesn't exist!");
//         console.log(err);
//         return "failure"
//     }
// }

// async function getUserName(wsID) {
//     try {
//         const userObject = await Users.findById(wsID);
//         return userObject;
//     } catch (err) {
//         console.log(err);
//     }
// }

// async function setIdAndStatusForWebsocket({
//     _id
// }) {
//     console.log("hiiii");
//     try {
//         const updateUser = await Users.findByIdAndUpdate(_id, {
//             userStatus: "online",
//             tempWebsocketId: _id
//         }, {
//             new: true
//         });

//         if (!updateUser) {
//             throw "Something went wrong";
//         }
//         return updateUser;
//     } catch (err) {
//         console.log("use doesn't exist!");
//         console.log(err);
//         return "failure"
//     }
// }

// async function removeIdAndStatusForWebsocket(wsId) {
//     try {
//         const updateUser = await Users.findByIdAndUpdate(wsId, {
//             userStatus: "offline",
//             tempWebsocketId: false
//         })
//         if (!updateUser) {
//             throw "Something went wrong";
//         }
//         console.log("userStats changed");
//     } catch (err) {
//         console.log("user doesn't exist!");
//         console.log(err);
//     }
// }

// async function saveImgToDatabase(obj) {
//     // https://www.youtube.com/watch?v=WDrU305J1yw&ab_channel=Academind
//     // Debate how to error handling, like this guy!
//     try {
//         // TODO this is dangerous, fix and do something else with base64!
//         const galleryObj = new Gallery({
//             base64: obj.imageMsg,
//             user: obj.user
//         });
//         let success = await galleryObj.save();

//         if (success) {
//             console.log("img saved!");
//         }
//     } catch (err) {
//         console.log("image didn't save!");
//         console.log(err);
//     }
// }

// async function getCollectionOfGallery() {
//     try {
//         const listOfImages = await Gallery.find({});
//         if (!listOfImages || listOfImages.length === 0) {
//             throw "There sadly isn't any pictures posted online yet D:";
//         }
//         return listOfImages;
//     } catch (err) {
//         return err
//     }
// }

// async function getUsersOnline() {
//     try {
//         const arrayOfUsersOnline = await Users.find({
//             userStatus: "online"
//         });
//         if (!arrayOfUsersOnline) {
//             throw "Something went wrong";
//         }
//         return arrayOfUsersOnline;
//     } catch (err) {
//         console.log("user doesn't exist!");
//         console.log(err);
//     }
// }

// export {
//     resetDatabaseUsers,
//     addNewUser,
//     checkForUser,
//     getUserName,
//     setIdAndStatusForWebsocket,
//     removeIdAndStatusForWebsocket,
//     saveImgToDatabase,
//     getCollectionOfGallery,
//     getUsersOnline
// }