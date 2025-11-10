const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User=require("./models/user");

app.post("/signup", async (req,res)=>{
    //creating a new instance of the user model
    const user=new User({
        firstName:"Rahul",
        lastName:"Ashok",
        emailId:"rahulashok@gmail.com",
        password:"ausr@1290"

    });
    
    try{
        await user.save();
        res.send("user addded successfully");

    }catch(err){
        res.status(400).send("error saving the user:"+err.message);
    }
    

})

connectDB()
    .then(() => {
        console.log("✅ Database connected brooo!");
        app.listen(8080, () => {
            console.log("🚀 Server is successfully listening to port 8080.");
        });
    })
    .catch((err) => {
        console.error("❌ Database cannot be established:", err);
    });
