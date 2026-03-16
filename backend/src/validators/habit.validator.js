import {z} from "zod";

const createHabitSchema = z.object({
    title: z.string({message:'Title is required'})
    .min(1, {message: 'Title is required'})
    .max(255, {message: 'Title must be under 255 characters'})
    .trim(), // why use trim here

    description: z.string()
    .max(1000, {message: 'Description must be under 1000 words'})
    .trim()
    .optional(),

    frequency: z.enum(['daily', 'weekly', 'monthly'],{
        error: 'Frequency must be daily, weekly or monthly'
    }).default('daily'),

    reminderTime: z.string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
      message: 'Reminder time must be in HH:MM format',
    })
    .optional()
    .or(z.literal('')),

});

//udpate schema - all fields optioinal
const updateHabitSchema= createHabitSchema.partial(); // partial() makes every field in the schema optional. so fro updates, the user can send the fields they want to change. one liine instead of rewritin the whole schema, object

export{createHabitSchema, updateHabitSchema};