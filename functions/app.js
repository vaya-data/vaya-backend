import express from 'express';
import cors from 'cors';
import admin from 'firebase-admin';
import authRouter from './routes/userRoutes.js';
import pitchRouter from './routes/pitchRoutes.js';




// initilize firebase admin

admin.initializeApp();

const app = express();

// Middle ware
app.use(cors());
app.use(express.json());

// Use Routes

app.use('/user', authRouter);
app.use('/pitch', pitchRouter);

export default app
