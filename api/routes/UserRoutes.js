import express from "express";
import { deleteUser, getListedItem, getUser, test, updateUser } from "../controllers/UserController.js";
import { verifyToken } from "../utils/verifyUser.js";

const router= express.Router();

router.get("/test",test);
router.post("/update/:id", verifyToken,updateUser);
router.delete("/delete/:id",verifyToken,deleteUser);
router.get("/listings/:id",verifyToken,getListedItem);
router.get("/:id",verifyToken,getUser)
export default router;