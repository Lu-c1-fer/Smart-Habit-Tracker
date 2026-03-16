import express from "express";
import helmet from 'helmet';
import cors from 'cors';
import {rateLimit} from 'express-rate-limit';
import authRoutes from './routes/auth.route.js';
import habitRoutes from './routes/habit.route.js';
const app = express();
app.set('trust proxy',1);
// Security headers
app.use(helmet());

//CORS 
app.use(cors({
    origin: process.env.CLIENT_URL ?? 'http://localhost:5173',
    methods: ['GET', 'POST','PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type','Authorization'],
    credentials: true, //allow cookies if needed later
}));

//Rate Limiting - global(all routes)
const globalLimiter = rateLimit({
     windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,                   // max 100 requests per 15 min per IP
  message: {
    status: 'error',
    message: 'Too many requests, please try again after 15 minutes',
  },
  standardHeaders: true,   // sends RateLimit headers in response
  legacyHeaders: false,
});

app.use(globalLimiter);

// ── Auth rate limiting — stricter on login/register ─────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 10 : 100,
  message: 'Too many login attempts, please try again after 15 minutes'
});
app.use(express.json()); //parse JSON bodies

// rotues will be mounted here later
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/habits', habitRoutes);

//health check
app.get('/health', (req,res)=>{
    return res.status(200).json({
        status:'ok',
        timestamp: new Date().toISOString(),
    });
});

//Global error handler
app.use((err,req,res,next)=>{
    const statusCode= err.statusCode?? 500;
    const message = err.message ?? 'Internal server error';

    res.status(statusCode).json({
        status: 'error',
        message,
    });
});
export default app;