function checkUserAccess(req, res, next) {
    if (!req.session.userHasAccess) {
        return res.redirect('/login');
    } else {
        next(); 
    } 
}

function denyUserRoute(req, res, next) {
    if (req.session.userHasLoggedIn) {
        return res.redirect('/logout');
    }
    return next();
}

export {
    checkUserAccess,
    denyUserRoute, 
}
