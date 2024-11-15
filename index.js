import express from 'express';

import * as dotenv from 'dotenv';
dotenv.config();

import debug from 'debug';
const debugIndex = debug('app:Index');

import { authMiddleware } from '@merlin4/express-auth';

import { dogOwnerRouter } from './routes/api/dogOwner.js';
import { orderRouter } from './routes/api/order.js';
import { userRouter } from './routes/api/user.js';
import cookieParser from 'cookie-parser';
<<<<<<< HEAD

=======
>>>>>>> f49765ccfe23a77bf44c5adf43c455fad53c1c73

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies to req.body
app.use(express.json()); // Parse JSON bodies to req.body
app.use(express.static('frontend/dist')); // Serve the Next.js frontend

app.use(cookieParser());

app.use(authMiddleware(process.env.JWT_SECRET, 'authToken',{
  httpOnly:true,
  maxAge: 1000 * 60 * 60
}));

app.use(cookieParser());

app.use(
  authMiddleware(process.env.JWT_SECRET, 'authToken', {
    httpOnly: true,
    maxAge: 1000 * 60 * 15,
  })
);


app.get('/', (req, res) => {
  res.send('Hello World!')
});


app.listen(port, () => {
  debugIndex(`Example app listening on port http://localhost:${port}`);
});

app.use('/api/pet-owners', dogOwnerRouter);
app.use('/api/orders', orderRouter);
<<<<<<< HEAD
app.use('/api/users', userRouter);
=======
app.use('/api/users', userRouter);

//handle server exceptions to keep my server from crashing
app.use((err, req, res, next) => {
  res.status(err.status).json({error: err.message});
});
>>>>>>> f49765ccfe23a77bf44c5adf43c455fad53c1c73
