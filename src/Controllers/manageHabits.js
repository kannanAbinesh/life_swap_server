/* Plugins. */
const fs = require('fs');
const Habits = require('../Models/Habits');
const HabitImages = require('../Models/HabitImages');

module.exports = {
    manageHabits: async (req, res) => {
        try {

            const { habitName, description, timeDuration, lifestyle } = req.body;
            const { _id: userId } = req?.user || {};

            if (!habitName || !description || !timeDuration || !lifestyle) {
                if (req.files && req.files.length > 0) {
                    req.files.forEach(file => {
                        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
                    });
                };
                return res.status(400).json({ status: 400, message: 'Please provide all required fields: habitName, description, timeDuration, lifestyle' });
            };

            // Create new habit
            const newHabit = new Habits({
                userId,
                habitName,
                description,
                timeDuration,
                lifestyle,
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
                message: 'Habit created successfully with images',
                data: newHabit
            });

        } catch (error) {
            console.error('Manage Habits Error:', error);
            return res.status(500).json({
                success: false,
                status: 500,
                message: 'Something went wrong, please try again later.'
            });
        }
    }
};
