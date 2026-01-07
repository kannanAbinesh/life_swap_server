const Habits = require('../Models/Habits');
const mongoose = require('mongoose');

module.exports = {
    getHabits: async (req, res) => {
        try {
            const { type, searchQuery, habitId } = req?.query;
            const userId = req?.user?._id;

            // If habitId is provided, fetch that specific habit with full details
            if (habitId) {
                const pipeline = [
                    {
                        $match: {
                            _id: new mongoose.Types.ObjectId(habitId)
                        }
                    },
                    {
                        $lookup: {
                            from: 'HabitImages',
                            localField: '_id',
                            foreignField: 'habitId',
                            as: 'images'
                        }
                    },
                    {
                        $lookup: {
                            from: 'Users',
                            localField: 'userId',
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
                    {
                        $lookup: {
                            from: 'ProfileImage',
                            localField: 'userId',
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
                    {
                        $lookup: {
                            from: 'AdoptedHabits',
                            localField: '_id',
                            foreignField: 'habitId',
                            as: 'adoptedUsers'
                        }
                    },
                    {
                        $addFields: {
                            user: {
                                userId: '$userId',
                                name: '$userInfo.name',
                                profileImage: '$profileImageInfo.image'
                            },
                            adoptedCount: { $size: '$adoptedUsers' }
                        }
                    },
                    {
                        $project: {
                            userInfo: 0,
                            profileImageInfo: 0,
                            userId: 0,
                            adoptedUsers: 0
                        }
                    }
                ];

                const habitDetails = await Habits.aggregate(pipeline);

                if (!habitDetails || habitDetails.length === 0) {
                    return res.status(404).json({
                        success: false,
                        status: 404,
                        message: 'Habit not found'
                    });
                }

                return res.status(200).json({
                    success: true,
                    status: 200,
                    message: 'Habit details fetched successfully',
                    data: habitDetails[0]
                });
            }

            // Original logic for type-based fetching
            let matchCondition = {};

            if (type === 'myhabit') {
                if (!userId) return res.status(400).json({ status: 400, message: 'Unauthorized: User not found' });

                // Base condition - user's habits
                matchCondition.userId = new mongoose.Types.ObjectId(userId);

                // Add search query condition ONLY for myhabit type
                if (searchQuery && searchQuery.trim() !== '') {
                    const searchRegex = new RegExp(searchQuery.trim(), 'i');
                    matchCondition.$or = [
                        { habitName: searchRegex },
                        { description: searchRegex },
                        { lifeStyle: searchRegex }
                    ];
                }
            } else if (type === 'explore') {
                // For explore: fetch all habits EXCEPT the current user's habits
                if (userId) {
                    matchCondition.userId = { $ne: new mongoose.Types.ObjectId(userId) };
                }
            }

            // Build aggregation pipeline
            let pipeline = [
                { $match: matchCondition },
                {
                    $lookup: {
                        from: 'HabitImages',
                        localField: '_id',
                        foreignField: 'habitId',
                        as: 'images'
                    }
                }
            ];

            // Add user lookup only for explore type
            if (type === 'explore') {
                pipeline.push(
                    {
                        $lookup: {
                            from: 'Users',
                            localField: 'userId',
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
                    {
                        $lookup: {
                            from: 'ProfileImage',
                            localField: 'userId',
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
                    {
                        $addFields: {
                            user: {
                                name: '$userInfo.name',
                                profileImage: '$profileImageInfo.image'
                            }
                        }
                    },
                    {
                        $project: {
                            userInfo: 0,
                            profileImageInfo: 0
                        }
                    }
                );
            }

            // Add sort at the end
            pipeline.push({ $sort: { createdAt: -1 } });

            // Execute aggregation
            const habitsWithImages = await Habits.aggregate(pipeline);

            return res.status(200).json({
                success: true,
                status: 200,
                message: 'Habits fetched successfully',
                data: habitsWithImages
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                status: 500,
                message: 'Something went wrong, please try again later.'
            });
        }
    }
};