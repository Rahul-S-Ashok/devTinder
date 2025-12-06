const express = require("express");
const requestRouter = express.Router();
const User=require("../models/user");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

//interested and ignored ge
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus=["ignored","interested"];
      if(!allowedStatus.includes(status)){
        return res.status(400).json({message:"Invalid status type: "+ status});

      }
      
      const toUser = await User.findById(toUserId);

      if(!toUser){
        return res.status(404).json({message:"User Not Found"});
      }
      
      const existingConnectRequest = await ConnectionRequest.findOne({
        $or:[
          { fromUserId , toUserId },

          { fromUserId: toUserId, toUserId:fromUserId },
        ],
      });

      if(existingConnectRequest){
        return res
          .status(400)
          .send({message:"Connection Request Already Exist!"});
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      return res.json({
       message: `${req.user.firstName} is ${status} in ${toUser.firstName}`,
        data,
      });

    } catch (err) {
      return res.status(400).send("ERROR: " + err.message);
    }
  }
);


//accepted and rejected ge
requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth , 
  async(req,res)=>{

  try{                                        
     const loggedInUser=req.user;             //Akshay=>elon loggedInId==toUserId  status=interested validate the status
     const { status ,requestId }=req.params;

     //validate the status
     const allowedStatus=["accepted","rejected"];
     if(!allowedStatus.includes(status)){
      return res.status(400).json({message:"Status is not allowed"});
     }
     
     const connectionRequest=await ConnectionRequest.findOne({
      _id:requestId,
      toUserId:loggedInUser._id,
      status:"interested",
     });

     if(!connectionRequest){
      return res
          .status(404)
          .json({message:"Connection request not found"});
     }

     connectionRequest.status= status;

     const data=await connectionRequest.save();

     res.json({message:"Connection request " + status,data});


    }
  catch(err){
    res.status(400).send("ERROR:"+ err.message);
  }

 }
);


module.exports = requestRouter;
