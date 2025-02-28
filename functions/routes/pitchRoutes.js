import express from "express";
import { 
  addPitch, 
  getPitches, 
  getPitchById, 
  updatePitch, 
  deletePitch, 
  getPitchByName
} from "../controllers/pitchController.js";

const pitchRouter = express.Router();

// Define routes
pitchRouter.post("/addpitch", addPitch);       // Add a new pitch
pitchRouter.get("/getpitches", getPitches);    // Get all pitches
pitchRouter.get("/getpitch/:id", getPitchById); // Get a single pitch by ID
pitchRouter.get("/getpitch/name/:name", getPitchByName); // Get a single pitch by ID
pitchRouter.put("/updatepitch/:id", updatePitch); // Update a pitch by ID
pitchRouter.delete("/deletepitch/:id", deletePitch); // Delete a pitch by ID

export default pitchRouter;
