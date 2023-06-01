import express from "express";
import { adminLogin, createUser, getAllUser, getAuthToken, regenrateToken } from "../controllers/adminController.js";
import { hasAccess } from "../middleware/access.js";
import { isAuthenticatedUser } from "../middleware/auth.js";


const router = express.Router();

router.route("/getAllUser").get(getAllUser);
router.route("/adminLogin").post(adminLogin);
router.route("/createUser").post( createUser);
router.route("/getAuthToken").get(getAuthToken)
router.route("/regenrateToken").post(regenrateToken)




export default router;