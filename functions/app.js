import express from 'express';
import cors from 'cors';
import { admin } from './config/firebaseAdmin.js';
import authRouter from './routes/userRoutes.js';
import pitchRouter from './routes/pitchRoutes.js';
import gameRouter from './routes/gameRoutes.js';
import playerRoutes from './routes/playerRoutes.js';



const app = express();

// Middle ware
app.use(cors());
app.use(express.json());

// Use Routes

app.use('/user', authRouter);
app.use('/pitch', pitchRouter);
app.use('/game', gameRouter);
app.use('/player', playerRoutes)

export default app
