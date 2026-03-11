import {Router} from "express";
import {
    createHabit, 
    getHabits,
    getHabit,
    updateHabit,
    removeHabit,
    logHabit,
    getHabitStreak,
    getHabitsStreaks
} from "../controllers/habit.controller.js";
import {protect} from "../middlewares/auth.middleware.js"
import {validate} from "../middlewares/validate.js"
import { createHabitSchema, updateHabitSchema } from "../validators/habit.validator.js";

const router = Router();

// protect runs on All habit routes - must be logged in
router.use(protect);

router.get('/dashboard', getHabitsStreaks);

//Habits CRUD
router.post('/', validate(createHabitSchema), createHabit);
router.get('/', getHabits);
router.get('/:id', getHabit);
router.patch('/:id', validate(updateHabitSchema), updateHabit);
router.delete('/:id', removeHabit);

//tracking streaks
router.post('/:id/log', logHabit);
router.get('/:id/streak', getHabitStreak);


export default router;
