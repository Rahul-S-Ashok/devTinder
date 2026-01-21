const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    // 1️⃣ Read token from cookies
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).send("Please login!!!");
    }

    // 2️⃣ Verify token
    const decodedObj = jwt.verify(token, "DEV@TINDER$1290");

    const { _id } = decodedObj;

    // 3️⃣ Find user from DB
    const user = await User.findById(_id);
    if (!user) {
      return res.status(401).send("User not found");
    }

    // 4️⃣ Attach user to request
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).send("ERROR: " + err.message);
  }
};

module.exports = {
  userAuth,
};






// const jwt=require("jsonwebtoken");
// const User=require("../models/user");
// const userAuth= async (req, res, next) => {
//     //read the token from the req cookies
//     try{
//     const {token}=req.cookies;
//     if(!token){
//         return res.status(401).send("Please login!!!");
//     }

//     const decodedObj=await jwt.verify(token,"DEV@TINDER$1290");

//     const {_id}=decodedObj;

//     const user=await User.findById(_id);
//     if(!user){
//         throw new Error("user not found");
//     }
//     req.user=user;
//     next();
//     }catch(err){
//     res.status(400).send("ERROR:" +err.message);
//     }
//  }
   
//     //validate the token
//     //find the user  


// module.exports={
//     userAuth,
// }