import bcrypt from "bcryptjs";
import {createUser, findByEmail} from "../repositories/user.repo.js";
import { signToken } from "../utils/jwt.js";

const register = async ({name, email,password}) =>{
//Check if email already exists
const checkExist = await findByEmail(email);
if (checkExist){
    const error = new Error('Email already in use');
    error.statusCode =409; //409 conflict- more accrate than 400
    throw error;
}

//hash the password- never store plain
const hashedPassword = await bcrypt.hash(password, 12);
// 10 salt rounds- higher is slower but more secure. 10-12 is the sweet spot.

//create new user
const user = await createUser({name, email, password: hashedPassword});

//sign a token so they're immediately logged in after registering
const token = signToken({userId: user.id});
return {user, token};

};

const login = async ({email,password})=>{
// check if the email is there or not
const checkEmail = await findByEmail(email);

if (!checkEmail || !(await bcrypt.compare(password, checkEmail.password))){
//why the same error message? cause if you specify whats wrong the attacker can brute-force if they know one of them is true.

    const error = new Error('Invalid email or password');
    error.statusCode= 401; 
    throw error;
}

//sign token 
const token = signToken ({userId: checkEmail.id});

//strip password before returning - never send it to client
const {password: _, ...safeUser } = checkEmail; // it pulls password out (into a throwaway - and collects everthing in to safeUser. ES6 way to exlude a field withtou mutating the object)

return {user: safeUser, token};
};

export {register,login};