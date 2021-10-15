function checkAccession(req, res, next) {
    if (!req.session.validated) {
        return res.redirect('/login');
    }
    return next();
}

export {
    checkAccession
}