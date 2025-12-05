const express = require("express");
const requestRouter = express.Router();
const User=require("../models/user");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

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

module.exports = requestRouter;
