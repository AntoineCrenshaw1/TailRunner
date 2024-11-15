import express from 'express';
<<<<<<< HEAD
import debug from 'debug';
const debugUser = debug('app:UserRouter');

import Joi from 'joi';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import {validBody } from '../../middleware/validBody.js';
import {getUserByEmail, registerUser} from '../../database.js';

const router = express.Router();


//Schema for new users
const newUserSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(5).required(),
});

async function issueAuthToken(user){
    const token = jwt.sign({_id:user._id,email: user.email}, process.env.JWT_SECRET, {expiresIn: '1h'});
    return token;
}

async function issueAuthCookie(res,token, user){
    const cookieOptions = {httpOnly:true, maxAge:1000*60*60, sameSite:'strict', secure:true};
    res.cookie('authToken', token, cookieOptions);
}

router.get('/', (req, res) => {
    res.send({Message: 'Get all users route hit'});
});

router.post('/register', validBody(newUserSchema), async (req, res) => {
    const user = req.body;

    const existingUser = await getUserByEmail(user.email);

    if(existingUser){
        return res.status(400).json({message: 'User\'s email already exists'});
    }else {
        user.password = await bcrypt.hash(user.password, 10);
        debugUser(`User: ${JSON.stringify(user)}`);

        const insertUserResult = await registerUser(user);
        debugUser(`Insert User Result: ${JSON.stringify(insertUserResult)}`);

        if(insertUserResult.acknowledged){
            //Issue JWT token
            const jwtToken = await issueAuthToken(user);

            //Create auth cookie
          await issueAuthCookie(res, jwtToken);
            res.status(201).json({message: 'User registered successfully'});
        }else{
            res.status(500).json({message: 'User registration failed'});
        }
    }
});

router.post('/login', validBody(newUserSchema), async (req, res) => {
    const user = req.body;

    try{
    const existingUser = await getUserByEmail(user.email);

    if(!existingUser){
        return res.status(400).json({message: 'User does not exist'});
    }

    const passwordMatch = await bcrypt.compare(user.password, existingUser.password);

    if(!passwordMatch){
        return res.status(401).json({message: 'Invalid password'});
    }

    const jwtToken = await issueAuthToken(existingUser);
    await issueAuthCookie(res, jwtToken);


    res.status(200).json({message: 'User logged in successfully'});
}catch {
    res.status(500).json({message: 'Login failed'});
}
=======

import debug from 'debug';
const debugUser = debug('app:User');

import Joi from 'joi';
import bcrypt from 'bcrypt';

import { validBody } from '../../middleware/validBody.js';

import { registerUser, getUserByEmail, findRoleByName } from '../../database.js';

import jwt from 'jsonwebtoken';

import { fetchRoles, mergePermissions } from '@merlin4/express-auth';

const router = express.Router();

//Schema for new users
const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(5).required()
});

async function issueAuthToken(user){
 

  const roles = await fetchRoles(user, role => findRoleByName(role));

  const permissions = mergePermissions(user, roles);
 // debugUser(permissions);
  const token = jwt.sign({_id:user._id,email: user.email, role:user.role, permissions:permissions}, process.env.JWT_SECRET, {expiresIn: '1h'});
  //debugUser(token);
  return token;
}

async function issueAuthCookie(res,token){
  const cookieOptions = {httpOnly:true, maxAge:1000*60*60, sameSite:'strict', secure:true};
  res.cookie('authToken', token, cookieOptions);
}

router.get('/', (req, res) => {
  res.json({message:'Get All Users Route Hit'});
});

router.post('/register', validBody(userSchema),async (req, res) => {
  const user = req.body;
  let existingUser = null;
  try{
   existingUser = await getUserByEmail(user.email);
  }catch(e){
    debugUser(e);
    res.status(500).json({message: 'Error registering user'});
  }
  if(existingUser){
    return res.status(400).json({message: 'User\'s email already exists'});
  }else{

  user.password = await bcrypt.hash(user.password, 10);
  user.role = ['customer'];  
  const insertUserResult = await registerUser(user);

  if(insertUserResult.acknowledged){
    //Generate JWT
    const jwtToken = await issueAuthToken(user);

    //Create Auth Cookie
    await issueAuthCookie(res, jwtToken);
    res.status(201).json({message: 'User registered successfully'});
  }else{
    res.status(500).json({message: 'Error registering user'});
  }
} 
});

router.post('/login', validBody(userSchema), async (req, res) => {

  const user = req.body;

  try{
      const existingUser = await getUserByEmail(user.email);
      if(!existingUser){
        return res.status(200).json({message: 'Invalid email or password'});
      }
      const passwordMatch = await bcrypt.compare(user.password, existingUser.password);
      if(!passwordMatch){
        return res.status(200).json({message: 'Invalid email or password'});
      }
      const jwtToken = await issueAuthToken(existingUser);
      await issueAuthCookie(res, jwtToken);
      res.status(200).json({message: 'User logged in successfully'});
    }catch(e){
      debugUser(e);
      res.status(500).json({message: 'Error logging in user'});
    }
>>>>>>> f49765ccfe23a77bf44c5adf43c455fad53c1c73
});



<<<<<<< HEAD





export {router as userRouter} 
=======
export {router as userRouter};
>>>>>>> f49765ccfe23a77bf44c5adf43c455fad53c1c73
