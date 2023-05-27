import cookieParser from "cookie-parser";
import express from "express";

const app  = express();

app.use(express.json());
app.use(cookieParser());


 import user from "./routes/userRoutes.js";
 import admin from "./routes/adminRoutes.js"
 import errorMiddleware from "./middleware/error.js"

app.use("/api/v1", user);
app.use("/api/v1",admin)

 app.use(errorMiddleware);
export default app;