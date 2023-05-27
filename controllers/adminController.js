import Auth from "../models/auth.js";
import User from "../models/user.js"
import { v4 as uuidv4 } from 'uuid';
import Errorhandler from "../utils/ErrorHandler.js";
export const getAllUser = async (req, res, next) => {
  const result = await User.find();
  res.status(200).json({
    success: true,
    message: "All users",
    result,
  });
};

export const createUser = async (req, res, next) => {
  try {
    const {
      name,
      email,
      dateOfBirth,
      gender,
      phone,
      role,
      image,
    } = req.body;
    let user = await User.findOne({ email: email });

    if (user) return next(new Errorhandler("User already exists", 400));



    const result = await User.create({
      name: name,
      image: image,
      role: role,
      email: email,
      dateOfBirth: dateOfBirth,
      gender: gender,
      phone: phone,

    });

    if (result) {
      const code = uuidv4();
      const expirationTime = Date.now() + 5 * 60 * 1000;

      const token = await Auth.create({
        userId: result._id,
        verified: false,
        expirationTime: expirationTime,
        code: code

      })
      console.log("Token genrated Successfully")
    }
    res.status(200).json({
      success: true,
      message: "User Created Successfully",
      result,
    });


  } catch (error) {
    console.log(error)
    // next(error);
  }

}

export const getAuthToken= async(req,res,next)=>{
  const result = await Auth.find();
  res.status(200).json({
    success: true,
    message: "All Auth",
    result,
  });
}

export const regenrateToken = async(req,res,next)=>{

  const userId= req.body.userId;
  console.log(userId)
  if(!userId) return next(new Errorhandler("please specify the user", 400));

  const code = uuidv4();
  const expirationTime = Date.now() + 5 * 60 * 1000;
const result= await Auth.findOneAndUpdate(
  {userId:userId},
  {verified:false,
    expirationTime:expirationTime,
    code:code
  },
  {
    new:true
  }
  )
  if(!result) next(new Errorhandler("User not found", 400));

  res.status(200).json({
    success: true,
    message: "Code regenrated",
    result,
  });

}
