import jwt from 'jsonwebtoken';

const signToken= (payload) =>
    jwt.sign(payload,process.env.JWT_SECRET, { expiresIn:'7d'});

const verifyToken =(token)=>
    jwt.verify(token, process.env.JWT_SECRET);

export {signToken, verifyToken};