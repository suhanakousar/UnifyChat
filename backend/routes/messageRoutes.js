// routes/messageRoutes.js
const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");

router.post("/rooms/:roomId/messages", messageController.createMessage);
router.put("/messages/:messageId", messageController.editMessage);
router.delete("/messages/:messageId", messageController.deleteMessage);

module.exports = router;