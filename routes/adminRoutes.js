import express from "express";
import { createUser, getAllUser, getAuthToken, regenrateToken } from "../controllers/adminController.js";

const router = express.Router();

router.route("/getAllUser").get(getAllUser);
router.route("/createUser").post(createUser);
router.route("/getAuthToken").get(getAuthToken)
router.route("/regenrateToken").post(regenrateToken)




export default router;