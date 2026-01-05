/* Models. */
const AdoptedHabits = require('../Models/AdoptedHabits');
const Habits = require('../Models/Habits');
const mongoose = require('mongoose');

module.exports = {
    adoptHabits: async (req, res) => {
        try {
            const { habitId } = req?.query;
            const userId = req?.user?._id;

            // Validation: Check if habitId is provided
            if (!habitId) {
                return res.status(400).json({
                    success: false,
                    status: 400,
                    message: 'Habit ID is required'
                });
            }

            // Validation: Check if userId exists
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    status: 401,
                    message: 'Unauthorized: User not found'
                });
            }

            // Validation: Check if habitId is a valid ObjectId
            if (!mongoose.Types.ObjectId.isValid(habitId)) {
                return res.status(400).json({
                    success: false,
                    status: 400,
                    message: 'Invalid Habit ID'
                });
            }

            // Check if the habit exists
            const habitExists = await Habits.findById(habitId);
            if (!habitExists) {
                return res.status(404).json({
                    success: false,
                    status: 404,
                    message: 'Habit not found'
                });
            }

            // Check if user is trying to adopt their own habit
            if (habitExists.userId.toString() === userId.toString()) {
                return res.status(400).json({
                    success: false,
                    status: 400,
                    message: 'You cannot adopt your own habit'
                });
            }

            // Check if the habit is already adopted by the user
            const alreadyAdopted = await AdoptedHabits.findOne({
                habitId: new mongoose.Types.ObjectId(habitId),
                userId: userId.toString()
            });

            if (alreadyAdopted) {
                return res.status(409).json({
                    success: false,
                    status: 409,
                    message: 'You have already adopted this habit'
                });
            }

            // Create new adopted habit
            const newAdoptedHabit = new AdoptedHabits({
                habitId: new mongoose.Types.ObjectId(habitId),
                userId: userId.toString(),
                createdAt: new Date(),
                updatedAt: null
            });

            // Save to database
            const savedAdoptedHabit = await newAdoptedHabit.save();

            // Fetch the complete habit details with images
            const habitDetails = await Habits.aggregate([
                {
                    $match: { _id: new mongoose.Types.ObjectId(habitId) }
                },
                {
                    $lookup: {
                        from: 'HabitImages',
                        localField: '_id',
                        foreignField: 'habitId',
                        as: 'images'
                    }
                }
            ]);

            return res.status(201).json({
                success: true,
                status: 201,
                message: 'Habit adopted successfully',
                data: {
                    adoptedHabit: savedAdoptedHabit,
                    habitDetails: habitDetails[0] || null
                }
            });

        } catch (error) {
            console.error('Error in adoptHabits:', error);
            return res.status(500).json({
                success: false,
                status: 500,
                message: 'Something went wrong in adopt habits section'
            });
        }
    }
};