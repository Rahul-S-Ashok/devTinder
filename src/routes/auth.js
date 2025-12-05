const express=require("express");
const authRouter=express.Router();
const {validateSignUpData}=require("../utils/validation");
const User=require("../models/user");
const bcrypt = require("bcrypt");


authRouter.post("/signup", async (req,res)=>{
    try{
    //validation of data
    validateSignUpData(req);

    const{firstName,lastName,emailId,password}=req.body;
    
    //encrypt the password
    const passwordHash=await bcrypt.hash(password,10);
    
    
    //creating a new instance of the user model
    const user=new User({
        firstName,
        lastName,
        emailId,
        password:passwordHash,
    });
    
    await user.save();
    res.send("user addded successfully");

    }catch(err){
        res.status(400).send("error saving the user:"+err.message);
    }
    

});

authRouter.post("/login", async(req,res)=>{
    try{

        const{emailId,password}=req.body;
        const user= await User.findOne({emailId:emailId});
        if(!user){
            throw new Error("Ivalid credentials");
        }

        const isPasswordValid=await user.validatePassword(password);
        if(isPasswordValid){

            const token=await user.getJWT();
           //Add the token to cookie and send the response back to the user
            res.cookie("token",token,{
            expires:new Date(Date.now() + 8 * 3600000),
           });
           res.send("login Successfullll!!!");
        }
        else{
            throw new Error("Ivalid credentials");
        }

    }
    catch(err){
        res.status(400).send("ERROR:" + err.message);
    }
});

authRouter.post("/logout", async(req,res)=>{
    res.cookie("token", null,{
        expires:new Date(Date.now()),
    });
    res.send("Logout Successfull");

})




module.exports = authRouter;