import { 
  createUser, 
  getAllUsersModel, 
  getUserByIdModel, 
  updateRoleModel, 
  updateUserModel, 
  deleteUserModel, 
  blacklistUserModel, 
  unblacklistUserModel 
} from "../models/userModel.js";

/**
 * Register a new user
 * @route POST /register
 */
export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    const userRecord = await createUser(email, password, name);

    return res.status(201).json({ 
      message: 'User registered successfully',
      uid: userRecord.uid
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Get all users
 * @route GET /users
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await getAllUsersModel();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Get a single user by UID
 * @route GET /user/:uid
 */
export const getUserById = async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await getUserByIdModel(uid);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Update user role
 * @route PUT /user/role
 */
export const updateRole = async (req, res) => {
  try {
    const { uid, role } = req.body;

    if (!uid || !role) {
      return res.status(400).json({ error: 'UID and role are required' });
    }

    if (!['admin', 'organizer', 'player'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    await updateRoleModel(uid, role);

    return res.status(200).json({ 
      message: 'User role updated successfully',
      uid,
      role
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Update user details
 * @route PUT /user/update
 */
export const updateUser = async (req, res) => {
  try {
    const { uid, updateData } = req.body;

    if (!uid || !updateData) {
      return res.status(400).json({ error: 'UID and update data are required' });
    }

    const success = await updateUserModel(uid, updateData);

    if (!success) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Delete user
 * @route DELETE /user/:uid
 */
export const deleteUser = async (req, res) => {
  try {
    const { uid } = req.params;

    const success = await deleteUserModel(uid);

    if (!success) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Blacklist a user
 * @route PUT /user/blacklist/:uid
 */
export const blacklistUser = async (req, res) => {
  try {
    const { uid } = req.params;

    const success = await blacklistUserModel(uid);

    if (!success) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ message: 'User blacklisted successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Unblacklist a user
 * @route PUT /user/unblacklist/:uid
 */
export const unblacklistUser = async (req, res) => {
  try {
    const { uid } = req.params;

    const success = await unblacklistUserModel(uid);

    if (!success) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ message: 'User unblacklisted successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
