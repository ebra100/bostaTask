import createError, { HttpError } from "http-errors";
import express, { Response, Request, NextFunction } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";

import sequelize from "./config/dbConnection"
import "./schedulers/check"

import authRouter from "./routes/authRouter"
import checkRouter from "./routes/checkRouter"
const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "jade");
app.use(express.static(path.join(__dirname, "public")));

app.use("/auth", authRouter);
app.use("/check", checkRouter);
app.use("/test2", (req, res) => {
	res.send("test2")
})

// catch 404 and forward to error handler
app.use(function (req: Request, res: Response, next: NextFunction) {
	next(createError(404));
});

sequelize.sync()
// error handler
app.use(function (err: HttpError, req: Request, res: Response, next: NextFunction) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
});

export default app;
