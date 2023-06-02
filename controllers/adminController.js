import Auth from "../models/auth.js";
import User from "../models/user.js";
import Errorhandler from "../utils/Errorhandler.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import uploadImageFromBase64 from "../utils/cloudinary.js";
export const getAllUser = async (req, res, next) => {
  const result = await User.find({ isDeleted: false });
  res.status(200).json({
    success: true,
    message: "All users",
    result,
  });
};

function generateRandomCode() {
  var code = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;

  for (var i = 0; i < 6; i++) {
    var randomIndex = Math.floor(Math.random() * charactersLength);
    code += characters.charAt(randomIndex);
  }

  return code;
}

export const createUser = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      aadhar,
      pan,
      state,
      city,
      address,
      phone,
      role,
      image,
      designation,
      department,
    } = req.body.personalInfo;
    const { password, email } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !aadhar ||
      !pan ||
      !state ||
      !city ||
      !address ||
      !phone ||
      !role ||
      !designation ||
      !department
    ) {
      return next(new Errorhandler("Empty fileds", 400));
    }
    let user = await User.findOne({ email: email, isDeleted: false });

    if (user) return next(new Errorhandler("User already exists", 400));

    let hashedpassword = "";
    let code = "";
    let codeCreateTime = "";
    let verified = false;

    if (role === "HR") {
      if (!password || !email)
        return next(new Errorhandler("enter password", 400));
      hashedpassword = await bcrypt.hash(password, 10);
      verified = true;
    }
    if (role === "EMPLOYEE") {
      code = generateRandomCode();

      codeCreateTime = Date.now();
    }

    console.log(code, codeCreateTime, "time");

    console.log(hashedpassword, "haehsh");

    const result = await User.create({
      personalInfo: {
        firstName: firstName,
        lastName: lastName,
        image: image,
        role: role,
        phone: phone,
        aadhar: aadhar,
        pan: pan,
        state: state,
        city: city,
        address: address,
        designation: designation,
        department: department,
      },
      password: hashedpassword,
      email: email,
      code: code,
      codeCreateTime: codeCreateTime,
      verified: verified,
    });
    console.log(result, "result");
    if (!result) return next(new Errorhandler("Some error", 400));

    res.status(200).json({
      success: true,
      message: "User Created Successfully",
      result,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getAuthToken = async (req, res, next) => {
  const result = await Auth.find();
  res.status(200).json({
    success: true,
    message: "All Auth",
    result,
  });
};

export const regenrateToken = async (req, res, next) => {
  try {
    const userId = req.body.userId;
    console.log(userId);
    if (!userId) return next(new Errorhandler("please specify the user", 400));

    const code = generateRandomCode();
    const codeCreateTime = Date.now();

    const result = await User.findOneAndUpdate(
      {
        _id: userId,
        isDeleted: false,
      },
      {
        verified: false,
        codeCreateTime: codeCreateTime,
        code: code,
        isCodeUsed: false,
      },
      {
        new: true,
      }
    );
    if (!result) next(new Errorhandler("User not found", 400));
    console.log(result, "res");

    res.status(200).json({
      success: true,
      message: "Code regenrated",
      result,
    });
  } catch (error) {
    next(error);
  }
};

export const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);

    if (!email || !password) {
      return next(new Errorhandler("Enter both email and pass"), 400);
    }
    const user = await User.findOne({ email: email, isDeleted: false }).select(
      "+password"
    );

    if (!user) return next(new Errorhandler("User dosent exist", 400));

    let comparePassword = await bcrypt.compare(password, user.password);

    if (!comparePassword)
      return next(new Errorhandler("Wrong email or password", 400));

    console.log(user, "user");
    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
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
      token,
    });
  } catch (error) {
    next(error);
  }
};

// export const employeeLogin = async (req, res, next) => {
//   const { code, loginTime } = req.body;

//   if (!code && !loginTime) return next(new Errorhandler("Error with the code", 400));

//   const user = await User.findOne({ code: code, isCodeUsed: false, isDeleted:false });

//   if (!user) return next(new Errorhandler("No employee found here", 400));

//   if (Number(loginTime) - Number(user.codeCreateTime) > 60000) return next(new Errorhandler("Cannot login", 400));

//   const payload = {
//     id: user._id,
//     firstName: user.personalInfo.firstName,
//     lastName: user.personalInfo.lastName,
//     email: user.email,
//     code: user.code,
//   };
//   const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
//     expiresIn: process.env.JWT_KEY_EXPIRE,
//   });

//   const result = await User.findOneAndUpdate({ _id: user._id, isDeleted:false }, { isLogin: true, isCodeUsed: true, verified: true }, { new: true });

//   res.status(200).json({
//     success: true,
//     token,
//     result
//   })

// }

export const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.body;

    if (!userId) return next(new Errorhandler("Send Id please", 400));
    const result = await User.findOneAndUpdate(
      {
        userId: userId,
        isDeleted: false,
      },
      { isDeleted: true },
      { new: true }
    );

    if (!result) return next(new Errorhandler("User not found", 400));

    res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    next(error);
  }
};

//edit user---

export const editUser = async (req, res, next) => {
  try {
    const { findQuery, updateQuery } = req.body;

    if (!findQuery || !updateQuery)
      return next(new Errorhandler("fields not specified", 400));

    const result = await User.findOneAndUpdate(findQuery, updateQuery, {
      new: true,
    });

    if (!result) return next(new Errorhandler("Not found", 400));

    res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    next(error);
  }
};

export const editAttendence = async (req, res, next) => {
  try {
    const { findQuery, updateQuery } = req.body;

    if (!findQuery || !updateQuery)
      return next(new Errorhandler("send fields", 400));

    const result = await User.findOneAndUpdate(findQuery, updateQuery, {
      new: true,
    });

    if (!result) return next(new Errorhandler("Not found", 400));

    res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    next(error);
  }
};

export const cloudinaryTesting = async (req, res, next) => {
  try {
    const result = await uploadImageFromBase64(req.body.image);
    console.log(result.url);
    res.json({
      hello: "helllo",
    });
  } catch (error) {
    console.log(error, "erorr");
  }
};
