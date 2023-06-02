import cookieParser from "cookie-parser";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();

//app.use(express.json({limit:'10mb'}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(cors());

import user from "./routes/userRoutes.js";
import admin from "./routes/adminRoutes.js";
import errorMiddleware from "./middleware/error.js";

app.use("/api/v1", user);
app.use("/api/v1", admin);

app.use(errorMiddleware);
export default app;
