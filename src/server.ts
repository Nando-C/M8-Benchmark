import {
	badRequestErrorHandler,
	catchAllErrorHandler,
	notFoundErrorHandler,
} from "./errorHandlers";

import accomodationsRouter from "./services/accomodations/index"
import cors from "cors";
import express from "express";
// import facebookStrategy from './auth/oauth.js'
import listEndpoints from "express-list-endpoints";
import mongoose from "mongoose";
// import passport from 'passport'
import usersRouter from "./services/users/index"

console.time("Server startup");
const server = express();
// process.env.TS_NODE_DEV && require("dotenv").config()
const port = process.env.PORT || 3069;

// passport.use('facebook', facebookStrategy)

// ><><><><: MIDDLEWARES :><><><>< \\

server.use(express.json());
server.use(cors());
// server.use(passport.initialize())

// ><><><><: ROUTES :><><><>< \\

server.use("/users", usersRouter);
server.use("/accomodations", accomodationsRouter)
console.table(listEndpoints(server));

// ><><><><: ERROR MIDDLEWARES :><><><>< \\

server.use(badRequestErrorHandler);
server.use(notFoundErrorHandler);
server.use(catchAllErrorHandler);

// ><><><><: MONGO TIME :><><><>< \\


mongoose.connect(process.env.MONGO_CONNECTION as string, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
});

const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Connected to MongoDB 🌵")).then(
	server.listen(port, () => {
		console.log("Running on port", port, "🎇");
		console.timeEnd("Server startup");
	})
);
