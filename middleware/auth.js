import Errorhandler from "../utils/ErrorHandler.js";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const isAuthenticatedUser = async(req, res, next)=>{
    // const {token} = req.cookies;

    // if(!token) return next(new Errorhandler("invalid token", 400));

    // const decodedUser = jwt.verify(token,process.env.JWT_SECRET_KEY);
    // console.log(decodedUser, "user");
    // //here decodedUser contains the payload that we attached in the token.
    // //we can use _id from decodedUser to find the user and attach that user to req. but its not feasable;
    // req.user = decodedUser;

    const bearerHeader = req.headers["authorization"];

  if (!bearerHeader) return next(new Errorhandler("Invalid token", 400));

  const bearer = bearerHeader.split(" ");

  const bearerToken = bearer[1];

  const decodedData = jwt.verify(bearerToken, process.env.JWT_SECRET_KEY);

//   let user = await User.findById(decodedData.id, "name email role _id");
console.log(decodedData, "decodedData")
  req.user = decodedData;
  next();
}