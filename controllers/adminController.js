import Auth from "../models/auth.js";
import User from "../models/user.js"
import { v4 as uuidv4 } from 'uuid';
import Errorhandler from "../utils/ErrorHandler.js";
import bcrypt from "bcryptjs";
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
      password
    } = req.body;
    let user = await User.findOne({ email: email });

    if (user) return next(new Errorhandler("User already exists", 400));

    let hashedpassword = "";

    if (role === "HR") {
      hashedpassword = await bcrypt.hash(password, 10);
    }
    console.log(hashedpassword, "haehsh")

    const result = await User.create({
      name: name,
      image: image,
      role: role,
      email: email,
      dateOfBirth: dateOfBirth,
      gender: gender,
      phone: phone,
      password: hashedpassword
    });
    console.log(result, "result")
    if (!result) return next(new Errorhandler("Some error", 400))

    if (result && role === "EMPLOYEE") {
      const code = uuidv4();
      const expirationTime = Date.now() + 5 * 60 * 1000;
      const token = await Auth.create({
        userId: result._id,
        verified: false,
        expirationTime: expirationTime,
        code: code
      })
      console.log(token, "token")
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

export const getAuthToken = async (req, res, next) => {
  const result = await Auth.find();
  res.status(200).json({
    success: true,
    message: "All Auth",
    result,
  });
}

export const regenrateToken = async (req, res, next) => {

  const userId = req.body.userId;
  console.log(userId)
  if (!userId) return next(new Errorhandler("please specify the user", 400));

  const code = uuidv4();
  const expirationTime = Date.now() + 5 * 60 * 1000;
  const result = await Auth.findOneAndUpdate(
    { userId: userId },
    {
      verified: false,
      expirationTime: expirationTime,
      code: code
    },
    {
      new: true
    }
  )
  if (!result) next(new Errorhandler("User not found", 400));

  res.status(200).json({
    success: true,
    message: "Code regenrated",
    result,
  });

}

export const adminLogin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new Errorhandler("Enter both email and pass"), 400);
  }
  const user = await User.findOne({ email: email }).select("+password");
  if (!user) return next(new Errorhandler("User dosent exist", 400));

  const payload = {
    id: user._id,
    name: user.name,
    email: user.email,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_KEY_EXPIRE,
  });

  const options = {
    expire: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  res.status(200).cookie("token", token, options).json({
    success: true,
    user,
    token
  });
}

const employeeLogin = async(req, res, next) =>{
  const {code} = req.body;

  if(!code) return next(new Errorhandler("Error with the code", 400));

  const user = await Auth.findOne({code : code});

  if(!user) return next(new Errorhandler("No employee found here", 400));

  const payload = {
    id: user.userId,
    code: user.code,
    expirationTime: user.expirationTime
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_KEY_EXPIRE,
  });

  res.status(200).json({
    success: true,
    token,
    user
  })


}