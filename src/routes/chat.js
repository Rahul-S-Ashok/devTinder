const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { Chat } = require("../models/chat");

const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
  const { targetUserId } = req.params;
  const userId = req.user._id;

  try {
    // 🔥 MARK MESSAGES AS SEEN
    await Chat.updateOne(
      {
        participants: { $all: [userId, targetUserId] },
      },
      {
        $set: {
          "messages.$[msg].seen": true,
        },
      },
      {
        arrayFilters: [
          {
            "msg.senderId": targetUserId,
            "msg.seen": false,
          },
        ],
      }
    );

    let chat = await Chat.findOne({
      participants: { $all: [userId, targetUserId] },
    }).populate({
      path: "messages.senderId",
      select: "firstName lastName",
    });

    // create chat if not exists
    if (!chat) {
      chat = new Chat({
        participants: [userId, targetUserId],
        messages: [],
      });
      await chat.save();
    }

    res.json(chat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching chat" });
  }
});

module.exports = chatRouter;
