// controllers/messageController.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createMessage = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { text, userId } = req.body;
    console.log("roomId:", roomId);
    // Validate incoming data
    if (!roomId || !text || !userId) {
      return res
        .status(400)
        .json({ error: "Missing required fields (roomId, text, userId)." });
    }

    // 1. Create the new message
    const newMessage = await prisma.message.create({
      data: {
        content: text,
        created_by: userId,
        chat_id: roomId,
      },
      include: {
        sender: {
          select: {
            id: true,
            given_name: true,
            profile_picture: true,
          },
        },
      },
    });

    // 2. Update the last_message field of the room
    await prisma.chatRoom.update({
      where: { id: roomId },
      data: {
        last_message: text,
        updated_at: new Date(),
      },
    });

    // 3. Update read status for all users (set unread = true), except sender
    await prisma.chatRoomRead.updateMany({
      where: {
        chat_id: roomId,
        NOT: {
          user_id: userId,
        },
      },
      data: {
        unread: true,
      },
    });

    return res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error creating message:", error);
    return res.status(500).json({ error: "Failed to create message" });
  }
};

exports.editMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { content, userId } = req.body;

    if (!content || !userId) {
      return res.status(400).json({ error: "Missing required fields (content, userId)" });
    }

    // Get the message first to check ownership
    const message = await prisma.message.findUnique({
      where: { id: messageId },
      include: {
        sender: {
          select: {
            id: true,
            given_name: true,
            profile_picture: true,
          },
        },
      },
    });

    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    // Check if user is the message creator
    if (message.created_by !== userId) {
      return res.status(403).json({ error: "You can only edit your own messages" });
    }

    // Update the message
    const updatedMessage = await prisma.message.update({
      where: { id: messageId },
      data: {
        content: content,
      },
      include: {
        sender: {
          select: {
            id: true,
            given_name: true,
            profile_picture: true,
          },
        },
      },
    });

    return res.status(200).json(updatedMessage);
  } catch (error) {
    console.error("Error editing message:", error);
    return res.status(500).json({ error: "Failed to edit message" });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Get the message first to check ownership
    const message = await prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    // Check if user is the message creator
    if (message.created_by !== userId) {
      return res.status(403).json({ error: "You can only delete your own messages" });
    }

    // Delete the message
    await prisma.message.delete({
      where: { id: messageId },
    });

    return res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting message:", error);
    return res.status(500).json({ error: "Failed to delete message" });
  }
};