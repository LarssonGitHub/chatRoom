import {getUserName} from "./database.js"

async function getCurrentUser(wsId) {
    const userObj = await getUserName(wsId);
    console.log("hello from current user", userObj);
    return userObj.userName;
   
//    console.log("Why won't you work!!", userName);
    // console.log("WORK DAMNIT!!!!", userName.userName);
    // get user id and post it with attached name and ms..! (remove client side temp and display on client side.....! Only let the user know if it didn't post..!)
}

function userJoin(wsId) {
    const currentUser = getCurrentUser(wsId);
    return currentUser.userName;
    //  SET temp socket id... on user on the database
}

// https://github.com/websockets/ws/issues/859
// add date lib https://www.skypack.dev/view/dayjs
// 


function userLeave() {
    //   DELETE temp socket id on when this user disconnects, and update database 
}

// async function getUsersOnline() {
//     const arrayOfusersOnline = await Users.find({userStatus:"online"});
//     console.log(arrayOfusersOnline);

// }

function getUsersOffline() {
    //   Get all users, no matter if online or not.
}

function getRoomUserInteger() {
    // Get how many users is online in number form from online sockets.
}

export {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUserInteger,
    getUserName
}