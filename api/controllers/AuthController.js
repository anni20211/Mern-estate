import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { ErrorHandler } from "../utils/error.js";
import Jwt  from "jsonwebtoken";

export const signup=async(req,res,next)=>{
    const {username,email,password}=req.body;
    const hashPassword=bcrypt.hashSync(password,10);
    const newUser=new User({username,email,password:hashPassword});
    try {
        await newUser.save();
    res.status(201).json("user created successfully");  
    } catch (error) {
        // next(ErrorHandler(500,"Internal Server Eroor"));//for manual error send .
        next(error);
    }
}
export const signin=async(req,res,next)=>{
    const {email,password}=req.body;
    try{
        const user= await User.findOne({email});
        if(!user) return next(ErrorHandler(404,"User not found"));
        const Validpassword=bcrypt.compareSync(password,user.password);
        if(!Validpassword) return next(ErrorHandler(401,"Wrong Credentials"));
        const token=Jwt.sign({id:user._id},process.env.JWT_SECRET_KEY);
        const {password:pass,...rest_part}=user._doc;
        res.cookie("access_token",token,{
            httpOnly:true,
            expires:new Date(Date.now()+24*60*60*1),
        }).status(200).json(rest_part);
    }catch(error){
        next(error);

    }


}

export const google=async(req,res,next)=>{
    try {
        const user=await User.findOne({email:req.body.email});
        if(user){
            const token=Jwt.sign({id:user._id},process.env.JWT_SECRET_KEY);
            const {password:pass,...rest}=user._doc;
            res.cookie("access_token",token,{ httpOnly:true})
            .status(200).json(rest);

        }else{
            const generatePassword=Math.random().toString(36).slice(-8)+Math.random().toString(36).slice(-8)
            const hashedPassword=bcrypt.hashSync(generatePassword,10);
            const newUser= new User({username:req.body.name.split(" ").join("").toLowerCase()+Math.random().toString(36).slice(-4),email:req.body.email,password:hashedPassword,avatar:req.body.photo});
            await newUser.save();
            const token=Jwt.sign({id:newUser._id},process.env.JWT_SECRET_KEY);
            const {password:pass,...rest}=newUser._doc;
            res.cookie("access_token",token,{ httpOnly:true})
            .status(200).json(rest);
        }
    } catch (error) {
        next(error); 
    }

}

export  const logout=async(req,res,next)=>{
    try {
        res.clearCookie("access_token");
        res.status(200).json("user logout successfully !");
        
    } catch (error) {
        next(error);
        
    }
}