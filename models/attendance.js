import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    day: {type: String, required: true},
    month: {type: String, required: true},
    year: {type: String, required: true},
    startTime: {type: String, required: true},
    userLocation:{
        longitute:{type:String},
        latitute:{type:String},
        country:{type:String}
    },
    endTime: {type: String, required: true},
    totalHour:{type: String, required: true},
    status: {type: String, required: true},
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() }
})

const Attendance = mongoose.model("Attendance", attendanceSchema);

export default Attendance;