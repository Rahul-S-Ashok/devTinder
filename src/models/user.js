const mongoose = require("mongoose");
const validator= require("validator");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");
const userSchema= new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:4,
        maxLength:50,
    },
    lastName:{
        type:String,
    
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email address:"+ value);
            }
        }

    },
    password:{
        type:String,
        required:true,
         validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a strong password:"+ value);
            }
        }
    },
    age:{
        type:Number,
        min:18,
    },
    gender:{
        type:String,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("gender data is not valid");
                
            }
        }
    },
    photoUrl:{
        type:String,
        default:"https://imgs.search.brave.com/rticBLtPzqkml3P7ia7dlLg8ZA3EJOIaNZjyrwduqAU/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/a2luZHBuZy5jb20v/cGljYy9tLzI1Mi0y/NTI0Njk1X2R1bW15/LXByb2ZpbGUtaW1h/Z2UtanBnLWhkLXBu/Zy1kb3dubG9hZC5w/bmc",
          validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid photo URL:"+ value);
            }
        }
    },
    about:{
        type:String,
        default:"This is a default about of the user",
    },
    skills:{
        type:[String],
        
    }
},
{
    timestamps:true,
});

userSchema.methods.getJWT= async function(){
    const user=this;
  //create a  JWT token
   const token= await jwt.sign({_id:user._id},"DEV@TINDER$1290",{expiresIn:"1d"});

   return token;
};

userSchema.methods.validatePassword=async function(passwordInputByUser){
    const user=this;
    const passwordHash=user.password;

    const isPasswordValid=await bcrypt.compare(passwordInputByUser,passwordHash);

    return isPasswordValid;
}

module.exports=mongoose.model("User",userSchema);