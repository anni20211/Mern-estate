import express from "express";
import { createListing, deletListing, getListing, updateListing,getAllList } from "../controllers/ListingController.js";

import { verifyToken } from "../utils/verifyUser.js";

const router=express.Router();

router.post("/createlist",verifyToken,createListing);
router.delete("/delete/:id",verifyToken,deletListing);
router.post("/update/:id",verifyToken,updateListing);
router.get("/getListing/:id",getListing);
router.get("/getAllList",getAllList)


export default router;

