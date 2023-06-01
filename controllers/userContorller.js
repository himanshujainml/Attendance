import Auth from "../models/auth.js";
import Errorhandler from "../utils/ErrorHandler.js";
import User from "../models/user.js";
import Attendance from "../models/attendance.js";
import jwt from "jsonwebtoken"
// import Attendance from "../models/attendance.js;"

export const employeeLogin = async (req, res, next) => {
  const { code, loginTime } = req.body;

  if (!code && !loginTime) return next(new Errorhandler("Error with the code", 400));

  const user = await User.find({ code: code, isCodeUsed: false, isDeleted: false });
  if (user.length > 1) return next(new Errorhandler("Please regenrate token", 400));
  if (user.length == 0) return next(new Errorhandler("No employee found here", 400));


  if (Number(loginTime) - Number(user.codeCreateTime) > 60000) return next(new Errorhandler("Cannot login", 400));

  const payload = {
    id: user[0]._id,
    firstName: user[0].personalInfo.firstName,
    lastName: user[0].personalInfo.lastName,
    email: user[0].email,
    code: user[0].code,
    role: user[0].role
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_KEY_EXPIRE,
  });

  const result = await User.findOneAndUpdate({ _id: user[0]._id, isDeleted: false }, { isLogin: true, isCodeUsed: true, verified: true }, { new: true });

  res.status(200).json({
    success: true,
    token,
    result
  })


}

export const getParticularUserDeatils = async (req, res, next) => {
  const userId = req.body.userId;
  if (!userId) return next(new Errorhandler("User is not specified"))
  const result = await User.findOne({ _id: userId, isDeleted: false });

  if (!result) return next(new Errorhandler("User not found"))
  res.status(200).json({
    success: true,
    message: "Detail of one particular user",
    result,
  });
}

export const startDay = async (req, res, next) => {
  //we have to use process.env.OFFICE_COUNTRY instead of static INDIA
  console.log(process.env.OFFICE_COUNTRY, process.env.OFFICE_LAT, process.env.OFFICE_LON)
  const { userId, day, month, year, longitute, latitute, country, startTime } = req.body
  if (latitute == process.env.OFFICE_LAT && longitute == process.env.OFFICE_LON && country == "INDIA") {

    const alreadyMarked = await Attendance.findOne({
      userId: userId,
      day: day,
      month: month,
      year: year

    })
    if (alreadyMarked) return next(new Errorhandler("You have already marked your attendance"))

    const result = await Attendance.create({
      userId: userId,
      day: day,
      month: month,
      year: year,
      userLocation: {
        longitute: longitute,
        latitute: latitute,
        country: country
      },
      startTime: startTime,

      status: "Present"
    })
    res.status(200).json({
      success: true,
      message: "Atendence(checkIn) Marked",
      result,
    });
  }

  else return next(new Errorhandler("You are not at correct location"))

}

export const endDay = async (req, res, next) => {

  const { userId, day, month, year, endTime, latitute, longitute, country } = req.body;
  if (latitute == process.env.OFFICE_LAT && longitute == process.env.OFFICE_LON && country == "INDIA") {
    const data = await Attendance.findOne({
      userId: userId,
      day: day,
      month: month,
      year: year
    })
    if (!data) return next(new Errorhandler("SomeThing went wrong, may be you have not marked present"))
    if (!data.endTime) return next(new Errorhandler("You have already ended your office day"))
    const result = await Attendance.findOneAndUpdate({
      userId: userId,
      day: day,
      month: month,
      year: year,

    }, {
      endTime: endTime,
      // totalHour:endTime-data.startTime,
      // status: (endTime-data.startTime)>7? "Present":"HalfDay"
    }, {
      new: true
    })
    res.status(200).json({
      success: true,
      message: "Atendence(checkout) Marked",
      result,
    });
  }
  else return next(new Errorhandler("You are not at correct location"));

}



export const getAllUserMonthlyAttendance = async (req, res, next) => {
  const { month, year } = req.query
  const result = await Attendance.aggregate([
    {
      $match: {
        month: month,
        year: year
      }
    },
    {
      $group: {
        _id: {
          userId: "$userId",

        },
        attendance: { $push: "$$ROOT" }
      }
    },

    {
      $unwind: "$attendance"
    },
    {
      $sort: { "attendance.day": 1 }
    },
    {
      $group: {
        _id: "$_id",
        userId: { $first: "$_id.userId" },

        attendance: { $push: "$attendance" }
      }
    },
    {
      $project: {
        _id: 0,
        userId: 1,

        attendance: {
          $arrayToObject: {
            $map: {
              input: "$attendance",
              as: "item",
              in: {
                k: "$$item.day",
                v: {
                  day: "$$item.day",
                  month: "$$item.month",
                  year: "$$item.year",
                  startTime: "$$item.startTime",
                  endTime: "$$item.endTime",
                  status: "$$item.status",
                  totalHour: "$$item.totalHour"
                }
              }
            }
          }
        }
      }
    }
  ])
  res.status(200).json({
    success: true,
    message: "Monthly Attendance of all user",
    result,
  });

}
export const getAllUserTodayAttendance = async (req, res, next) => {
  const { day, month, year } = req.query
  if (!day || !month || !year) return next(new Errorhandler("Something went wrong"));
  const result = await Attendance.aggregate([
    {
      $match: {
        day: day,
        month: month,
        year: year
      }
    },

    {
      $project: {
        day: 1,
        month: 1,
        year: 1,
        startTime: 1,
        endTime: 1,
        status: 1,
        totalHour: 1
      }
    }
  ])
  res.status(200).json({
    success: true,
    message: "Daily attendance of all user",
    result,
  });
}

export const getAttendanceOfParticluarUser = async (req, res, next) => {
  const { userId, month, year } = req.query;
  if (!userId || !month || !year) return next(new Errorhandler("Something went wrong"));
  const result = await Attendance.aggregate([
    {
      $match: {
        userId: userId,
        month: month,
        year: year
      }
    },
    {
      $sort: { day: 1 }
    }
  ])
  res.status(200).json({
    success: true,
    message: "Daily attendance of all user",
    result,
  });
} 

