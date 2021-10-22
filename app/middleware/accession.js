function checkUserAccess(req, res, next) {
    if (!req.session.userHasAccess) {
        return res.redirect('/login');
    }
    return next();
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
    xxxxxxxxxxxxxxxxxxxxxxxxx
}
