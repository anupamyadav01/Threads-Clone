import { ConversationModel } from "../models/conversationModel.js";
import MessageModel from "../models/messageModel.js";
import { getRecipientSocketId } from "../socket/socket.js";

async function sendMessage(req, res) {
  try {
    const { recieverId, message, img } = req.body;
    const senderId = req.user._id;

    let conversation = await ConversationModel.findOne({
      participants: { $all: [senderId, recieverId] },
    });
    if (!conversation) {
      conversation = new ConversationModel({
        participants: [senderId, recieverId],
        lastMessage: {
          text: message,
          sender: senderId,
        },
      });
      await conversation.save();
    }

    const newMessage = new MessageModel({
      conversationId: conversation._id,
      sender: senderId,
      text: message,
    });

    await Promise.all([
      await newMessage.save(),
      conversation.updateOne({
        lastMessage: {
          text: message,
          sender: senderId,
        },
      }),
    ]);

    const recipientSocketId = getRecipientSocketId(recieverId);

    if (recipientSocketId) {
      try {
        io.to(recipientSocketId).emit("newMessage", newMessage);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }

    res.status(201).send(newMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getMessages(req, res) {
  const { otherUserId } = req.params;
  const userId = req.user._id;
  try {
    const conversation = await ConversationModel.findOne({
      participants: { $all: [userId, otherUserId] },
    });

    if (!conversation) {
      return res.status(404).json({ error: "ConversationModel not found" });
    }

    const messages = await MessageModel.find({
      conversationId: conversation._id,
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getConversationModels(req, res) {
  const userId = req.user._id;
  try {
    const conversations = await ConversationModel.find({
      participants: userId,
    }).populate({
      path: "participants",
      select: "username profilePic",
    });

    // remove the current user from the participants array
    conversations.forEach((conversation) => {
      conversation.participants = conversation.participants.filter(
        (participant) => participant._id.toString() !== userId.toString()
      );
    });
    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export { sendMessage, getMessages, getConversationModels };
