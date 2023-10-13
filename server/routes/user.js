import { Router } from "express";
import passport from "passport";
import User from "../models/user.js";
import { generateToken } from "../helpers/authenticationHelper.js";
import {
  registerUser,
  loginUser,
  logout,
  getUserData,
  getUserDatas,
} from "../controllers/userControllers.js";
const router = Router();

//http://localhost:5000/user/register
router.post("/register", registerUser);

//http://localhost:5000/user/login
router.post("/login", loginUser);

//http://localhost:5000/user/userData
router.post("/userData", getUserData);

//localhost:5000/user/userdatas
http: router.get("/userdatas", getUserDatas);

//http:localhost:5000/user/logout
router.get("/logout", logout);

export default router;
