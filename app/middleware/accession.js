function checkUserAccess(req, res, next) {
    if (!req.session.userHasAccess) {
        return res.redirect('/login');
    }
    return next();
}

export {
    checkUserAccess
}