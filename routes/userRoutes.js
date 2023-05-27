import express from "express";
import { getParticularUserDeatils, loginUser } from "../controllers/userContorller.js";

const router = express.Router();



router.route("/loginUser").post(loginUser);
router.route("/getParticularDetail").get(getParticularUserDeatils);

export default router;