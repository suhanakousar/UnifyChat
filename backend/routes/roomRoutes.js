const express = require("express");
const {
    createRoom,
    getChatRoomDetails,
    updateRoomData,
    requestJoin,
    handleMemberRequest,
    removeMember,
    leaveRoom,
    loadMessages,
    loadChatRooms,
    isAdmin,
    getReadStatus,
    updateReadStatus,
    getMembers,
    getPendingMembers,
    changeAdmin,
    isMember,
    deleteRoom,
    getPendingRooms
} = require("../controllers/roomController");
const { protect } = require('../controllers/authController');

const router = express.Router();

router.get("/", (req, res) => {
    res.json({ message: "test chat room ok" });
})

router.get("/:chatId", getChatRoomDetails);
router.get("/:chatId/messages", loadMessages);
router.get("/user/:userId", loadChatRooms);
router.get("/:chatId/admin/:userId", isAdmin);
router.get("/:chatId/readStatus/:userId", getReadStatus);
router.get("/:chatId/members", getMembers);
router.get("/:chatId/pending", getPendingMembers);
router.get("/pendingRooms/:userId", getPendingRooms);
router.get("/:chatId/isMember/:userId", isMember)

// Use auth middleware so we can derive the user id server-side from the JWT
router.post("/", protect, createRoom);
router.post("/:chatId/request", requestJoin);

router.put("/:chatId", updateRoomData);
router.put("/:chatId/readStatus/:userId", updateReadStatus);
router.put("/:chatId/memberRequest", handleMemberRequest);
router.put("/:chatId/changeAdmin/", changeAdmin)

router.delete("/:chatId/members/:userId", removeMember);
router.delete("/:chatId/leave/:userId", leaveRoom);
router.delete("/:chatId", deleteRoom);


module.exports = router;
