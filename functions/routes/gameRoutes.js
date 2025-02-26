import express from "express";
import { addGame, deleteGame, getGameById, getGames, updateGame } from "../controllers/gameController.js";

const gameRouter = express.Router();

// define routes

gameRouter.post("/addgame", addGame);
gameRouter.get("/games", getGames);
gameRouter.get("/game/:id", getGameById);
gameRouter.put("/updategame/:id", updateGame);
gameRouter.delete("/deletegame/:id", deleteGame);


export default gameRouter;
