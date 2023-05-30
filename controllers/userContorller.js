import Auth from "../models/auth.js";
import Errorhandler from "../utils/ErrorHandler.js";
import User from "../models/user.js";
import Attendance from "../models/attendance.js";
// import Attendance from "../models/attendance.js;"

export const loginUser = async (req, res, next) => {
  const code = req.body.code;
  if (!code) return next(new Errorhandler("Please enter the code", 400));
  const result = await Auth.findOneAndUpdate(
    { code: code, verified: false, expirationTime: { $gte: Date.now() } },
    { verified: true },
    {
      new: true,
    }
  );
  if (!result) return next(new Errorhandler("Code is Wrong or Expired", 400));

  res.status(200).json({
    success: true,
    result,
  });
};

export const getParticularUserDeatils = async (req, res, next) => {
  const userId = req.body.userId;
  if (!userId) return next(new Errorhandler("User is not specified"));
  const result = await User.findOne({ _id: userId });

  if (!result) return next(new Errorhandler("User not found"));
  res.status(200).json({
    success: true,
    message: "Detail of one particular user",
    result,
  });
};

//attendence start and end;
export const startDay_endDay = async (req, res, next) => {
  try {
    const {
      userId,
      startTime,
      endTime,
      longitude,
      latitude,
      country,
      date,
      month,
      year,
    } = req.body;

    if (
      latitude !== process.env.OFFICE_LAT ||
      longitude !== process.env.OFFICE_LON
    ) {
      return next(new Errorhandler("Cannot Login from this location", 400));
    }

    let updateQuery = {};
    if (startTime) {
      updateQuery = {
        status: "Present",
        startTime: startTime,
        userLocation: {
          longitude: longitude,
          latitude: latitude,
          country: country,
        },
        day: day,
        month: month,
        year: year,
      };
    } else if (endTime) {
      updateQuery = {
        endTime: endTime,
      };
    }

   const result = await Attendance.findOneAndUpdate(
      { userId: userId, date: date, month: month, year: year },
      updateQuery,
      {
        upsert: true,
      }
    );

    res.status(200).json({
      success: true,
      result: result,
    });
  } catch (error) {
    next(error);
  }
};

// get my attendence report-

export const attendenceReportMonthWiseOfUser = async (req, res, next) => {
  try {
    let userId = req.user.userId;
    let { month, year } = req.query;

    if (!month || !year)
      return next(new Errorhandler("Need all fields", 400));

    const result = await Attendance.aggregate([
      {
        $match: {
          $and: [
            { userId: userId },
            { month: month },
            { year: year },
          ],
        },
      },
    ]);

    res.status(200).json({
      success: true,
      result: result
    });
  } catch (error) {
    next(error);
  }
};


//date wise attendence-

export const datewiseAttendence = async(req, res, next)=>{
  try {
    let {date, month, year} = req.query;
    if(!date|| !month || !year) return next(new Errorhandler("fill all fields", 400));

    // const result = await Attendance.find({
    //   $and: [{date:date}, {month: month}, {year: year}]
    // });
    const result = await Attendance.aggregate([
      {$match: {$and : [{date:date}, {month: month}, {year: year}]}}
    ]);

    res.status(200).json({
      success: true,
      result: result
    })

  } catch (error) {
   next(error) 
  }
}



// export const startDay= async(req,res,next)=>{

//   const {userId,startTime, endTime, longitute,latitute,country,day,month,year}=req.body

//   if(startTime){
//     if(latitute==process.env.OFFICE_LAT && longitute==process.env.OFFICE_LON && country==process.env.OFFICE_COUNTRY)
// {const result = await Attendance.findOneAndUpdate(
//   {userId:userId},
//   {
// status:"Present",
// startTime:startTime,
// userLocation:{
//   longitute:longitute,
//   longitute:latitute,
//   country:country
// },
// day:day,
// month:month,
// year:year

//   },{
//     upsert:true
//   })}
//   else return next(new Errorhandler("Something went wrong, please change your location") )
//   }
//   else if(endTime){
//     if(latitute==process.env.OFFICE_LAT && longitute==process.env.OFFICE_LON && country==process.env.OFFICE_COUNTRY)
//     {
//     const result = await Attendance.findOneAndUpdate(
//       {userId:userId},
//       {
//         status:"Present",
//         endTime:endTime,
//  totalHour:

//       })
//   }
// else return  next(new Errorhandler("Something went wrong, please change your location") )
// }
// }

// export const endDay=async (req,res,next)=>{

// }
