
import app from "./app.js";
import dotenv from "dotenv";
dotenv.config({path: "config/config.env"});

import connectDatabase from "./config/database.js"
connectDatabase();


app.listen(process.env.PORT,()=>{
    console.log(`Server running on Port ${process.env.PORT}`)
})