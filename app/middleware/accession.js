function checkUserAccess(req, res, next) {
    if (!req.session.userHasAccess) {
        return res.redirect('/login');
    } else {
        next(); 
    } 
}

function denyUserRoute(req, res, next) {
    console.log("user is... ", req.session.userHasLoggedIn);
    if (req.session.userHasLoggedIn) {
        return res.redirect('/');
    }
    next();
}

export {
    checkUserAccess,
    denyUserRoute, 
}
