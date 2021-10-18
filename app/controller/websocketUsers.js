function userJoin(id, username, room) {
    //  SET temp socket id... on user on the database
}

function getCurrentUser(id) {
    // get user id and post it with attached name and ms..! (remove client side temp and display on client side.....! Only let the user know if it didn't post..!)
}

function userLeave() {
    //   DELETE temp socket id on when this user disconnects, and update database 
}

function getUsersOnline() {
    //   Get all the users with status online
}

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
    getRoomUserNames,
    getRoomUserInteger
}