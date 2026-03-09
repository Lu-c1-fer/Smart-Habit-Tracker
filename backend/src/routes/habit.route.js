import {Router} from "express";
import {
    createHabit, 
    getHabits,
    getHabit,
    updateHabit,
    removeHabit} from "../controllers/habit.controller.js";
import {protect} from "../middlewares/auth.middleware.js"
import {validate} from "../middlewares/validate.js"
import { createHabitSchema, updateHabitSchema } from "../validators/habit.validator.js";

const router = Router();

// protect runs on All habit routes - must be logged in
router.use(protect);

router.post('/', validate(createHabitSchema), createHabit);
router.get('/', getHabits);
router.get('/:id', getHabit);
router.patch('/:id', validate(updateHabitSchema), updateHabit);
router.delete('/:id', removeHabit);

export default router;
