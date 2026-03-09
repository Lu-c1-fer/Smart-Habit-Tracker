import { register,login } from "../services/auth.service.js";
//handles HTTP only. Reads request, calls service, sends response.

const registerUser = async (req,res,next)=>{
    try{
        const{name,email, password} = req.body;
        const{user,token}= await register({name,email,password});

         return res.status(201).json({
            status:'success',
            data: {user,token}
        });
           
    } catch(err){
        return next(err); //Pass to global error handler - never handle errors in controllers
    }
};

const loginUser = async (req,res,next)=>{
    try{
        const {email, password} = req.body;
        const {user,token}= await login({email,password});

         return res.status (200).json({
            status: 'success',
            data: {user,token}  
        });
    }catch (err){
         return next(err);
    }
};

export {registerUser, loginUser};