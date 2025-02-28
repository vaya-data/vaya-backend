import express from 'express';
import { leaveGame, joinGame } from '../controllers/playerController.js';

const playerRoutes = express.Router();

//define routes

playerRoutes.post("/join", joinGame);
playerRoutes.post("/finish", leaveGame);



export default playerRoutes;