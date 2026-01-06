/* Models. */
const AdoptedHabits = require('../Models/AdoptedHabits');
const mongoose = require('mongoose');

module.exports = {
    getAdoptedHabits: async (req, res) => {
        try {
            const userId = req?.user?._id;
            console.log(userId, 'userIduserIduserIduserId')

            if (!userId) {
                return res.status(400).json({
                    status: 400,
                    message: 'Unauthorized: User not found'
                });
            }

            // Build aggregation pipeline
            const pipeline = [
                // Match adopted habits for the current user
                {
                    $match: {
                        userId: new mongoose.Types.ObjectId(userId)
                    }
                },
                // Lookup the habit details
                {
                    $lookup: {
                        from: 'Habits',
                        localField: 'habitId',
                        foreignField: '_id',
                        as: 'habitInfo'
                    }
                },
                {
                    $unwind: {
                        path: '$habitInfo',
                        preserveNullAndEmptyArrays: true
                    }
                },
                // Lookup habit images
                {
                    $lookup: {
                        from: 'HabitImages',
                        localField: 'habitId',
                        foreignField: 'habitId',
                        as: 'images'
                    }
                },
                // Lookup user details from the habit creator
                {
                    $lookup: {
                        from: 'Users',
                        localField: 'habitInfo.userId',
                        foreignField: '_id',
                        as: 'userInfo'
                    }
                },
                {
                    $unwind: {
                        path: '$userInfo',
                        preserveNullAndEmptyArrays: true
                    }
                },
                // Lookup profile image
                {
                    $lookup: {
                        from: 'ProfileImage',
                        localField: 'habitInfo.userId',
                        foreignField: 'userId',
                        as: 'profileImageInfo'
                    }
                },
                {
                    $unwind: {
                        path: '$profileImageInfo',
                        preserveNullAndEmptyArrays: true
                    }
                },
                // Add user field with only required data
                {
                    $addFields: {
                        'habitInfo.user': {
                            _id: '$userInfo._id',
                            name: '$userInfo.name',
                            profileImage: '$profileImageInfo.image'
                        },
                        'habitInfo.images': '$images'
                    }
                },
                // Project final structure - only inclusion
                {
                    $project: {
                        _id: 1,
                        habitId: 1,
                        userId: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        habit: '$habitInfo'
                    }
                },
                // Sort by creation date
                {
                    $sort: { createdAt: -1 }
                }
            ];

            // Execute aggregation
            const adoptedHabits = await AdoptedHabits.aggregate(pipeline);

            return res.status(200).json({
                success: true,
                status: 200,
                message: 'Adopted habits fetched successfully',
                data: adoptedHabits
            });

        } catch (error) {
            console.error('Error fetching adopted habits:', error);
            return res.status(500).json({
                success: false,
                status: 500,
                message: 'Something went wrong in retrieving the adopted habits'
            });
        }
    }
};