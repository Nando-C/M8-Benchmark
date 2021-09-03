import createError from 'http-errors'

export const hostOnly = (req, res, next) => {
    if (req.user.role === 'Host') {
        next()
    } else {
        next(createError(403, "Host only!"))
    }
}

export const accomodationHost = (req, res, next) => {
	console.log("🍕", req);
	if (req.body.user === req.user._id.toString()) {
		next();
	} else {
		next(createError(403, "Not your property!"));
	}
};