import {Router} from 'express';
import  {loginUser, registerUser} from '../controllers/auth.controller.js';
import {validate} from "../middlewares/validate.js"
import {registerSchema, loginSchema} from '../validators/auth.validator.js';

const router = Router();

router.post('/register', validate(registerSchema), registerUser);
router.post('/login', validate(loginSchema), loginUser);

export default router;