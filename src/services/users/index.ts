import Accomodation from "../accomodations/schema.js"
import { JWTAuthenticate } from "../../auth/tools.js";
import { JWTMiddleware } from '../../auth/middlewares.js'
import User from "./schema.js";
import createError from "http-errors";
import express from "express";
import getUser from "./schema.js";
import { IUser } from '../../typings'

const usersRouter = express.Router();

//><><><><> CREATES NEW USER, RETURNS ID <><><><><\\

usersRouter.post("/register", async (req, res, next) => {
	try {
		const newUser = new User(req.body);
		const { _id } = await newUser.save();
		res.status(201).send({ _id });
	} catch (error) {
		next(error);
	}
});

//><><><><> CHECKS CREDENTIALS, RETURNS NEW ACCESS TOKEN <><><><><\\

usersRouter.post("/login", async (req, res, next) => {
	try {
		const { email, password } = req.body;
		const user = await User.checkCredentials(email, password);
		if (user) {
			const accessToken = await JWTAuthenticate(user);
			res.send({ accessToken });
		} else {
			next(createError(401, "Credentials not valid!"));
		}
	} catch (error) {
		next(error);
	}
});

//><><><><> GET ALL USERS <><><><><\\

usersRouter.get("/", JWTMiddleware, async (req, res, next) => {
	try {
		const users = await getUser.find({});
		res.send(users);
	} catch (error) {
		next(createError(500, "An error occurred while getting users"));
	}
});

// ><><><><> GET LOGGED IN USER INFO <><><><><\\

usersRouter.get("/me", JWTMiddleware, async (req, res, next) => {
	try {
		res.send(req.user);
	} catch (error) {
		console.log(error);
		next(createError(500, "An error occurred while finding you"));
	}
});

// ><><><><> GET SPECIFIC USER BY ID <><><><><\\

usersRouter.get("/:id", JWTMiddleware, async (req, res, next) => {
	try {
		const author = await User.getUser(req.params.id);
		author ? res.send(author) : next(createError(404, `User ${req.params.id} not found`));
	} catch (error) {
		next(error);
	}
});

// ><><><><> UPDATE USER INFO BY ID <><><><><\\

usersRouter.put("/:id", JWTMiddleware,  async (req, res, next) => {
	try {
		const userId = req.params.id.toString()
		const myId = req.user._id.toString()

		if ( userId === myId ) {
			const updatedUser = await User.findOneAndUpdate({_id: myId}, req.body, {new: true, runValidators: true})
			if (updatedUser) {
				res.send(updatedUser)
			} else {
				next(createError(404, `User Not Found!`))
			}
		} else {
			next(createError(404, `You are not authorized!`))
		}
	} catch (error) {
		next(error)
	}
	// const users = await User.getUser(req.params.id);
	// if (!users) {
	// 	next(createError(404, "id not found"));
	// }
	// const updatedUser = {
	// 	...req.body,
	// 	lastUpdatedOn: new Date(),
	// };
	
	// res.send(updatedUser);
});

// ><><><><> DELETE USER BY ID <><><><><\\

usersRouter.delete("/:id", JWTMiddleware, async (req, res, next) => {
	try {
		const userId = req.params.id.toString()
		const myId = req.user._id.toString()

		if ( userId === myId ) {
			const deletedUser = await User.findOneAndDelete({_id: myId})
			if (deletedUser) {
				res.status(204).send()
			} else {
				next(createError(404, `User Not Found!`))
			}
		} else {
			next(createError(404, `You are not authorized!`))
		}
	} catch (error) {
		next(error)
	}

	// try {
	// 	const users = await getUser.findByIdAndDelete(req.params.id);
	// 	if (users) {
	// 		res.status(204, "Success").send();
	// 	} else {
	// 		next(createError(404, `User ${req.params.id} not found`));
	// 	}
	// } catch (error) {
	// 	console.log(error);
	// 	next(createError(500, "An error occurred while deleting author"));
	// }
});


// ><><><><> GET LOGGED IN USER ACCOMODATIONS <><><><><\\

usersRouter.get("/me/accomodations", JWTMiddleware, async (req, res, next) => {
	
	try {
		const myAccomo = await Accomodation.find({user:req.user._id})
		res.send(myAccomo);
		
	} catch (error) {
		console.log(error);
		next(createError(500, "An error occurred while finding you"));
	}
});

//><><><><> REFRESH TOKEN CHECK <><><><><\\

usersRouter.post("/refreshToken", async (req, res, next) => {
	try {
		const { actualRefreshToken } = req.body;
		const { accessToken, refreshToken } = await refreshTokens(actualRefreshToken);
		res.send({ accessToken, refreshToken });
	} catch (error) {
		next(error);
	}
});

export default usersRouter;
