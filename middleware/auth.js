import Errorhandler from "../utils/ErrorHandler.js";
import jwt from "jsonwebtoken";

export const isAuthenticatedUser = async(req, res, next)=>{
    const {token} = req.cookies;

    if(!token) return next(new Errorhandler("invalid token", 400));

    const decodedUser = jwt.verify(token,process.env.JWT_SECRET_KEY);
    console.log(decodedUser, "user");
    //here decodedUser contains the payload that we attached in the token.
    //we can use _id from decodedUser to find the user and attach that user to req. but its not feasable;
    req.user = decodedUser;

    next();
}