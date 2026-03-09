import express from "express";
import authRoutes from './routes/auth.route.js';
import habitRoutes from './routes/habit.route.js';
const app = express();

app.use(express.json()); //parse JSON bodies

// rotues will be mounted here later
app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRoutes);

app.use((err,req,res,next)=>{
    const statusCode= err.statusCode?? 500;
    const message = err.message ?? 'Internal server error';

    res.status(statusCode).json({
        status: 'error',
        message,
    });
});
export default app;