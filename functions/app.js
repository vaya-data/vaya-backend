import express from 'express';
import cors from 'cors';
import admin from 'firebase-admin';
import authRouter from './routes/userRoutes.js';
import pitchRouter from './routes/pitchRoutes.js';
import gameRouter from './routes/gameRoutes.js';


// initilize firebase admin

admin.initializeApp();

const app = express();

// Middle ware
app.use(cors());
app.use(express.json());

// Use Routes

app.use('/user', authRouter);
app.use('/pitch', pitchRouter);
app.use('/game', gameRouter);

export default app
