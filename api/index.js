import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";

import userRouter from "./routes/UserRoutes.js";
import authRouter from "./routes/AuthRoute.js";
import listingRouter from "./routes/ListingRoute.js";
dotenv.config();
const __dirname = path.resolve();
const app = express();
app.use(cookieParser());
mongoose
  .connect(process.env.MONGO_URL, {})
  .then(() => {
    console.log("database connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.json());
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);

app.use(express.static(path.join(__dirname, "client/dist")));

app.use("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/dist/index.html"));
});
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const errMessage = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    errMessage,
  });
});

app.listen(8000, () => {
  console.log("server is running at 8000");
});
