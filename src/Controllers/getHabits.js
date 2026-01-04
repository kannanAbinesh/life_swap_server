const Habits = require('../Models/Habits');
const mongoose = require('mongoose');

module.exports = {
    getHabits: async (req, res) => {
        try {
            console.log('pppppppppppppppppppp')
            const type = req?.query?.type; // "browse" or "myhabit"
            const searchQuery = req?.query?.query; // search query
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

                // Base condition - user's habits
                matchCondition.userId = new mongoose.Types.ObjectId(userId);

                // Add search query condition ONLY for myhabit type
                if (searchQuery && searchQuery.trim() !== '') {
                    const searchRegex = new RegExp(searchQuery.trim(), 'i'); // case-insensitive search
                    matchCondition.$or = [
                        { habitName: searchRegex },
                        { description: searchRegex },
                        { lifeStyle: searchRegex }
                    ];
                }
            } else if (type === 'explore') {
                // For browse: fetch all habits EXCEPT the current user's habits
                // NO SEARCH for browse type
                if (userId) {
                    matchCondition.userId = { $ne: new mongoose.Types.ObjectId(userId) };
                }
                // If userId doesn't exist, fetch all habits (matchCondition remains empty)
            }
            // If type is neither "browse" nor "myhabit", fetch all habits

            // Build aggregation pipeline
            let pipeline = [
                { $match: matchCondition },
                {
                    $lookup: {
                        from: 'HabitImages',       // collection name for HabitImages
                        localField: '_id',          // Habit _id
                        foreignField: 'habitId',    // HabitImages.habitId
                        as: 'images'
                    }
                }
            ];

            // Add user lookup only for browse type
            if (type === 'explore') {
                pipeline.push(
                    {
                        $lookup: {
                            from: 'Users',              // Users collection
                            localField: 'userId',       // Habit userId
                            foreignField: '_id',        // User _id
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
                            from: 'ProfileImage',       // ProfileImage collection
                            localField: 'userId',       // Habit userId
                            foreignField: 'userId',     // ProfileImage userId
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