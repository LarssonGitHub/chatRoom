function checkUserAccess(req, res, next) {
    if (!req.session.userHasAccess) {
        return res.redirect('/login');
    }
    return next();
}

function checkUserFetchAccess(req, res, next) {
    if (req.session.hasLoggedIn) {
        return next();
    }
    // Safe measure, destroys cookie and logs the user out.
    return res.redirect('/logout');
}

// TODO find a better name...!
function xxxxxxxxxxxxxxxxxxxxxxxxx(req, res, next) {
    if (req.session.userHasAccess) {
        return res.redirect('/');
    }
    return next();
}

export {
    checkUserAccess,
    xxxxxxxxxxxxxxxxxxxxxxxxx,
    checkUserFetchAccess
}
