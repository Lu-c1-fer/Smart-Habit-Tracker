import express from "express";
import router from './routes/auth.route.js';
const app = express();

app.use(express.json()); //parse JSON bodies

// rotues will be mounted here later
app.use('/api/auth', router);

app.use((err,req,res,next)=>{
    const statusCode= err.satusCode?? 500;
    const message = err.message ?? 'Internal server error';

    res.status(statusCode).json({
        status: 'error',
        message,
    });
});
export default app;