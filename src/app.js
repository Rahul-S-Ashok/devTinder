const express = require("express");
const connectDB = require("./config/database");
const app = express();
const validator=require("validator");
const cookieParser=require("cookie-parser");
const jwt=require("jsonwebtoken");

app.use(express.json());
app.use(cookieParser());

const authRouter=require("./routes/auth");
const profileRouter=require("./routes/profile");
const requestRouter=require("./routes/request");
const userRouter = require("./routes/user");

app.use("/" , authRouter);
app.use("/" , profileRouter);
app.use("/" ,requestRouter);
app.use("/" , userRouter);


//Get uset by email
app.get("/user", async (req,res)=>{
    const userEmail=req.body.emailId;

    try{
        const users= await User.findOne({emailId:userEmail});
        if(users.length===0){
            res.status(404).send("user not found");
        }
        else{
            res.send(users);
        }
        res.send(user);
    }
    catch(err){
        res.status(400).send("something went wrong");
    }

   
})

//Feed api -GET/feed- get all the users from the database
app.get("/feed", async(req,res)=>{

    try{
        const users= await User.find({});
            res.send(users);
    }
    catch(err){
        res.status(400).send("something went wrong");
    }



})

//delete a user from the database
app.delete("/user", async(req,res)=>{
    const userId=req.body.userId;
    try{
        const user=await User.findByIdAndDelete(userId); //({_id:userId})
        res.send("user deleted succesfully");

    }
    catch(err){
        res.status(400).send("something went wrong");
    }
})

//update data of the user
app.patch("/user/:userId", async (req, res) => {
    const userId = req.params.userId;  // ✅ from params
    const data = req.body;

    try {
        const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];

        const isUpdateAllowed = Object.keys(data).every((key) =>
            ALLOWED_UPDATES.includes(key)
        );

        if (!isUpdateAllowed) {
            throw new Error("Update not allowed");
        }

        if (data?.skills && data.skills.length > 10) {
            throw new Error("Skills cannot be more than 10");
        }

        const user = await User.findByIdAndUpdate(
            userId,
            data,
            { runValidators: true, new: true }  // ✅ best practice
        );

        if (!user) {
            return res.status(404).send("User not found");
        }

        res.send("User updated successfully ✅");
    } catch (err) {
        res.status(400).send("Update failed: " + err.message);
    }
});



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
