function errHasSensitiveInfo(err) {
    console.log(err.toString());
    // If err contains sensitive info, make it into a generic string for user!
    if (typeof err === 'string' || err instanceof String) {
        return err
    }
    return "Something went horrible wrong with the validation, server, or database. Try again!"
}

export {
    errHasSensitiveInfo
}