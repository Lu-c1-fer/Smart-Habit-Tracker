import {verifyToken} from '../utils/jwt.js';
import { findById } from '../repositories/user.repo.js';


/**
 * this middleware:
 * separates authentication logic
 * prevents controller duplication
 * handles all jwt errors
 * validates db state
 * uses async/await
 * uses repository pattern
 * it extracts token from header, 
 * next checks if token exists
 * then verify token(JWT validation)
 * checks if user still exists in db
 * then if its all god attaches the user to req and call next()
 */

const protect = async (req, res, next)=> {
    try{
        //extract token from authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith('Bearer ')){
            const error = new Error('No token provided');
            error.statusCode = 401;
            throw error;
        }
        // "Bearer eydafs.... to "eydafs"
        const token = authHeader.split(' ')[1]; //splits string to array wehrever there is space and takes 1st index values

        //verify throws automatically if expired or tampered
        const decoded = verifyToken(token);

        //Fetch fresh user data - token could be valid but user deleted
        const user = await findById(decoded.userId);
        if(!user) {
            const error = new Error('User no longer exists');
            error.statusCode = 401;
            throw error;
        }

        //Attach user to request- available iin all downstream controllers
        req.user=user;
        return next(); // all good, move to controller
        
    } catch(err){
        //Handle JWT-specific errors with clear messages
        if(err.name=== 'JsonWebTokenError'){
            err.message= 'Invalid token';
            err.statusCode = 401;
        }
        if(err.name === 'TokenExpiredError'){
            err.message = 'Token expired, please login again';
            err.statusCode = 401;
        }
         next(err);

    }
}

export {protect};
 /**Why fetch the user from DB even if token is valid?
> The token could be 6 days old and perfectly valid — but the user might have been deleted yesterday. Always verify the user still exists. This is a real security consideration. 
> **Why `authHeader?.startsWith`?**
> Optional chaining `?.` — if `authHeader` is undefined, it returns undefined instead of throwing `Cannot read property 'startsWith' of undefined`. Clean ES2020 pattern.


**/