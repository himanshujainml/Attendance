import express from "express";

import { employeeLogin, endDay, getAllUserMonthlyAttendance, getAllUserTodayAttendance, getAttendanceOfParticluarUser, getParticularUserDeatils, startDay } from "../controllers/userContorller.js";

const router = express.Router();



router.route("/loginUser").post(employeeLogin);
router.route("/getParticularDetail").get(getParticularUserDeatils);
router.route("/startDay").post(startDay);
router.route("/endDay").post(endDay);
router.route("/getAllUserMonthlyAttendance").get(getAllUserMonthlyAttendance)
router.route("/getAllUserTodayAttendance").get(getAllUserTodayAttendance)
router.route("/getAttendanceOfParticluarUser").get(getAttendanceOfParticluarUser);

export default router;