import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
    userId: { type: String,  },
    day: {type: String, },
    month: {type: String, },
    year: {type: String, },
    startTime: {type: String, },
    userLocation:{
        longitute:{type:String},
        latitute:{type:String},
        country:{type:String}
    },
    endTime: {type: String, },
    totalHour:{type: String, },
    status: {type: String, },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() }
})

const Attendance = mongoose.model("Attendance", attendanceSchema);

export default Attendance;