/* Plugins. */
const fs = require('fs');
const Habits = require('../Models/Habits');
const HabitImages = require('../Models/HabitImages');

module.exports = {
    manageHabits: async (req, res) => {
        try {
            const { _id, habitName, description, timeDuration, lifeStyle } = req.body;
            const { _id: userId } = req?.user || {};

            if (!habitName || !description || !timeDuration || !lifeStyle) {
                if (req.files && req.files.length > 0) {
                    req.files.forEach(file => {
                        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
                    });
                }
                return res.status(400).json({
                    status: 400,
                    message: 'Please provide all required fields: habitName, description, timeDuration, lifeStyle'
                });
            }

            // EDIT MODE - If _id is provided
            if (_id) {
                // Find existing habit
                const existingHabit = await Habits.findOne({ _id, userId });

                if (!existingHabit) {
                    if (req.files && req.files.length > 0) {
                        req.files.forEach(file => {
                            if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
                        });
                    }
                    return res.status(404).json({
                        success: false,
                        status: 404,
                        message: 'Habit not found or you do not have permission to edit it'
                    });
                }

                // Update habit fields
                existingHabit.habitName = habitName;
                existingHabit.description = description;
                existingHabit.timeDuration = timeDuration;
                existingHabit.lifeStyle = lifeStyle;

                // Handle uploaded images if any
                if (req.files && req.files.length > 0) {
                    const imageDocuments = req.files.map(file => ({
                        image: file.filename,
                        habitId: existingHabit._id,
                    }));

                    const savedImages = await HabitImages.insertMany(imageDocuments);

                    // Add new image IDs to existing images array
                    existingHabit.images = [
                        ...(existingHabit.images || []),
                        ...savedImages.map(img => img._id)
                    ];
                }

                await existingHabit.save();

                return res.status(200).json({
                    success: true,
                    status: 200,
                    message: 'Habit updated successfully',
                    data: existingHabit
                });
            }

            // CREATE MODE - If no _id is provided
            const newHabit = new Habits({
                userId,
                habitName,
                description,
                timeDuration,
                lifeStyle
            });
            await newHabit.save();

            // Handle uploaded images
            if (req.files && req.files.length > 0) {
                const imageDocuments = req.files.map(file => ({
                    image: file.filename,
                    habitId: newHabit._id,
                }));

                const savedImages = await HabitImages.insertMany(imageDocuments);

                newHabit.images = savedImages.map(img => img._id);
                await newHabit.save();
            }

            return res.status(200).json({
                success: true,
                status: 200,
                message: 'Habit created successfully',
                data: newHabit
            });

        } catch (error) {
            // Clean up uploaded files in case of error
            if (req.files && req.files.length > 0) {
                req.files.forEach(file => {
                    if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
                });
            }

            return res.status(500).json({
                success: false,
                status: 500,
                message: 'Something went wrong, please try again later.'
            });
        }
    }
};