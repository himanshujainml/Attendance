import Errorhandler from "../utils/errorHandler.js";




export const hasAccess = (req, res, next)=>{
    console.log("hello");
    const {role} = req.user;
    const roles = ["HR"];

    let index = roles.findIndex(()=> role);

    if(index === -1) return next(new Errorhandler("not authorized", 400));

    next();

}