const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { getUser } = require('../utils/helper');

const getUserById = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await getUser(userId);
        
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        return res.json({
            id: user.id,
            email: user.email,
            given_name: user.given_name,
            profile_picture: user.profile_picture,
            preferred_lang: user.preferred_lang,
            created_at: user.created_at
        });
    }
    catch (err) {
        console.error("Error fetching user:", err.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const updateUser = async (req, res) => {
    try {
        // Get userId from protect middleware (req.user is set by authController.protect)
        // The protect middleware sets req.user to the raw database row from the query
        const userId = req.user?.id;
        
        if (!userId) {
            console.error("User ID not found in req.user:", req.user);
            return res.status(401).json({ error: "User not authenticated" });
        }
        
        console.log("Updating user:", userId);

        const { given_name, profile_picture, preferred_lang } = req.body;

        // Build update object with only provided fields
        const updateData = {};
        if (given_name !== undefined) updateData.given_name = given_name;
        if (profile_picture !== undefined) updateData.profile_picture = profile_picture;
        if (preferred_lang !== undefined) updateData.preferred_lang = preferred_lang;

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ error: "No fields to update" });
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData,
            select: {
                id: true,
                email: true,
                given_name: true,
                profile_picture: true,
                preferred_lang: true,
                created_at: true,
            }
        });

        return res.status(200).json({
            status: 'success',
            data: {
                user: {
                    id: updatedUser.id,
                    username: updatedUser.given_name,
                    email: updatedUser.email,
                    profile_picture: updatedUser.profile_picture,
                    preferred_lang: updatedUser.preferred_lang,
                    created_at: updatedUser.created_at,
                }
            }
        });
    }
    catch (err) {
        console.error("Error updating user:", err.message);
        if (err.code === 'P2025') {
            return res.status(404).json({ error: "User not found" });
        }
        return res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    getUserById,
    updateUser
};

