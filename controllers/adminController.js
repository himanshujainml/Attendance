import Auth from "../models/auth.js";
import User from "../models/user.js"
import { v4 as uuidv4 } from 'uuid';
import Errorhandler from "../utils/ErrorHandler.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
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
      firstName,
      lastName,
      email,
      aadhar,
      pan,
      state,
      city,
      address,
      phone,
      role,
      image,
      password
    } = req.body.personalInfo;
    let user = await User.findOne({ email: email });

    if (user) return next(new Errorhandler("User already exists", 400));

    let hashedpassword = "";
    let code = "";
    let codeCreateTime = "";
    let verified = false;

    if (role === "HR") {
      hashedpassword = await bcrypt.hash(password, 10);
      verified = true;
    }
    if (role === "EMPLOYEE") {
      code = uuidv4();
      codeCreateTime = Date.now();
    }
    console.log(code, codeCreateTime, "time");

    console.log(hashedpassword, "haehsh")

    const result = await User.create({
      personalInfo: {
        firstName: firstName,
        lastName: lastName,
        image: image,
        role: role,
        email: email,
        phone: phone,
        aadhar: aadhar,
        pan: pan,
        state: state,
        city: city,
        address: address,
      },
      password: hashedpassword,
      code: code,
      codeCreateTime: codeCreateTime,
      verified: verified
    });
    console.log(result, "result")
    if (!result) return next(new Errorhandler("Some error", 400))

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
  const codeCreateTime = Date.now();

  const result = await User.findOneAndUpdate(
    { _id: userId },
    {
      verified: false,
      codeCreateTime: codeCreateTime,
      code: code,
      isCodeUsed: false
    },
    {
      new: true
    }
  )
  if (!result) next(new Errorhandler("User not found", 400));
  console.log(result, "res")

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

export const employeeLogin = async (req, res, next) => {
  const { code, loginTime } = req.body;

  if (!code && !loginTime) return next(new Errorhandler("Error with the code", 400));

  const user = await User.findOne({ code: code, isCodeUsed: false });

  if (!user) return next(new Errorhandler("No employee found here", 400));


  if (Number(loginTime) - Number(user.codeCreateTime) > 60000) return next(new Errorhandler("Cannot login", 400));

  const payload = {
    id: user._id,
    firstName: user.personalInfo.firstName,
    lastName: user.personalInfo.lastName,
    email: user.email,
    code: user.code,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_KEY_EXPIRE,
  });

  const result = await User.findOneAndUpdate({ _id: user._id }, { isLogin: true, isCodeUsed: true, verified: true }, { new: true });

  res.status(200).json({
    success: true,
    token,
    result
  })


}