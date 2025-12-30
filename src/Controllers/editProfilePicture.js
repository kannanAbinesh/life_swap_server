/* ============================================
   CONTROLLER: imageUploadController.js
   ============================================ */

/* Plugins */
const path = require('path');
const fs = require('fs');

/* Models */
const User = require('../Models/Users');
const ProfileImage = require('../Models/ProfileImage');
const Habit = require('../Models/Habits'); // You'll need to create this model

module.exports = {

    /* ==========================================
       Upload Profile Picture
       ========================================== */
    editProfilePicture: async (req, res) => {
        try {
            const { _id } = req.user;

            if (!_id) {
                return res.status(401).json({
                    status: 401,
                    success: false,
                    message: 'Unauthorized: User ID missing.'
                });
            }

            // Check if file was uploaded
            if (!req.files || !req.files.files) {
                return res.status(400).json({
                    status: 400,
                    success: false,
                    message: 'No file uploaded.'
                });
            }

            const file = req.files.files;

            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
            if (!allowedTypes.includes(file.mimetype)) {
                return res.status(400).json({
                    status: 400,
                    success: false,
                    message: 'Invalid file type. Only JPG, PNG, and WEBP are allowed.'
                });
            }

            // Validate file size (5MB max)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                return res.status(400).json({
                    status: 400,
                    success: false,
                    message: 'File size exceeds 5MB limit.'
                });
            }

            /* Find user */
            const user = await User.findOne({ _id, deletedAt: null });
            if (!user) {
                return res.status(404).json({
                    status: 404,
                    success: false,
                    message: 'User not found.'
                });
            }

            // Create uploads directory if it doesn't exist
            const uploadDir = path.join(__dirname, '../uploads/profiles');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            // Generate unique filename
            const fileExtension = path.extname(file.name);
            const uniqueFileName = `profile_${_id}_${Date.now()}${fileExtension}`;
            const uploadPath = path.join(uploadDir, uniqueFileName);

            // Move file to uploads directory
            await file.mv(uploadPath);

            // Delete old profile picture if exists
            const oldProfileImage = await ProfileImage.findOne({ userId: _id });
            if (oldProfileImage && oldProfileImage.image) {
                const oldFilePath = path.join(__dirname, '../uploads/profiles', path.basename(oldProfileImage.image));
                if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath);
                }
            }

            // Save to database
            const imageUrl = `/uploads/profiles/${uniqueFileName}`;

            if (oldProfileImage) {
                oldProfileImage.image = imageUrl;
                oldProfileImage.updatedAt = new Date();
                await oldProfileImage.save();
            } else {
                await ProfileImage.create({
                    userId: _id,
                    image: imageUrl,
                });
            }

            // Update user's profilePicture field
            user.profilePicture = imageUrl;
            user.updatedAt = new Date();
            await user.save({ validateBeforeSave: false });

            return res.status(200).json({
                status: 200,
                success: true,
                message: 'Profile picture updated successfully.',
                imageUrl: imageUrl,
            });

        } catch (error) {
            console.error('Profile picture upload error:', error);
            return res.status(500).json({
                status: 500,
                success: false,
                message: 'Something went wrong, please try again later.',
                error: error.message
            });
        }
    },
};