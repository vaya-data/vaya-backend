import express from "express";
import { 
  register, 
  getAllUsers, 
  getUserById, 
  getUserByName,
  updateRole, 
  updateUser, 
  deleteUser, 
  blacklistUser, 
  unblacklistUser 
} from "../controllers/userController.js";

const authRouter = express.Router();

// User Authentication & Management Routes
authRouter.post("/register", register); // Register a new user
authRouter.get("/users", getAllUsers); // Get all users
authRouter.get("/user/:uid", getUserById); // Get a user by UID
authRouter.get("/user/name/:name", getUserByName); // Get a user by name
authRouter.put("/user/role", updateRole); // Update user role
authRouter.put("/user/update", updateUser); // Update user details
authRouter.delete("/user/:uid", deleteUser); // Delete a user
authRouter.put("/user/blacklist/:uid", blacklistUser); // Blacklist a user
authRouter.put("/user/unblacklist/:uid", unblacklistUser); // Unblacklist a user

export default authRouter;
