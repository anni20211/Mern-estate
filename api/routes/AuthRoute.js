import express from "express";
import {google, logout, signin, signup } from "../controllers/AuthController.js";


const router= express.Router();

router.post("/signup",signup)
router.post("/signin",signin)
router.post("/google",google)
router.get("/logout",logout);
export default router;