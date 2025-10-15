const Habits = require('../Models/Habits');
const mongoose = require('mongoose');

module.exports = {
    getHabits: async (req, res) => {
        try {
            const type = req?.query?.type; // "browse" or "myhabit"
            const userId = req?.user?._id;

            // Determine match condition
            let matchCondition = {};

            if (type === 'myhabit') {
                // For myhabit: only fetch habits belonging to the current user
                if (!userId) {
                    return res.status(401).json({
                        success: false,
                        status: 401,
                        message: 'Unauthorized: User not found'
                    });
                }
                matchCondition = { userId: new mongoose.Types.ObjectId(userId) };
            } else if (type === 'browse') {
                // For browse: fetch all habits EXCEPT the current user's habits
                if (userId) {
                    matchCondition = {
                        userId: { $ne: new mongoose.Types.ObjectId(userId) }
                    };
                }
                // If userId doesn't exist, fetch all habits (matchCondition remains empty)
            }
            // If type is neither "browse" nor "myhabit", fetch all habits

            // Aggregate habits with their images
            const habitsWithImages = await Habits.aggregate([
                { $match: matchCondition },
                {
                    $lookup: {
                        from: 'HabitImages',       // collection name for HabitImages (note: MongoDB uses lowercase pluralized name)
                        localField: '_id',          // Habit _id
                        foreignField: 'habitId',    // HabitImages.habitId
                        as: 'images'
                    }
                },
                { $sort: { createdAt: -1 } }     // latest habits first
            ]);

            return res.status(200).json({
                success: true,
                status: 200,
                message: 'Habits fetched successfully',
                data: habitsWithImages
            });

        } catch (error) {
            console.error('Get Habits Error:', error);
            return res.status(500).json({
                success: false,
                status: 500,
                message: 'Something went wrong, please try again later.'
            });
        }
    }
};