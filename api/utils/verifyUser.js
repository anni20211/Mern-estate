import jwt from "jsonwebtoken";
import { ErrorHandler } from "./error.js";

export const verifyToken=(req,res,next)=>{

    const token =req.cookies.access_token;
    if(!token)  return next(ErrorHandler(401, "unauthorized user"));

    jwt.verify(token,process.env.JWT_SECRET_KEY,(err,user)=>{
        if(err) return next(ErrorHandler(403, "Forbidden"))
        req.user=user;
        next();
    });

    


}