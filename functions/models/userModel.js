import { db } from "../config/firebaseAdmin.js";

/**
 * Create a new user in Firebase Authentication and Firestore
 * @param {string} email
 * @param {string} password
 * @param {string} name
 * @returns {Promise<Object>} Created user record
 */
export const createUser = async (email, password, name) => {
  const userRecord = await admin.auth().createUser({
    email,
    password,
  });

  // Add user with default values to Firestore
  const userData = {
    uid: userRecord.uid,
    email,
    name, // Use the provided name
    role: 'Player', // Default role
    blacklisted: false, // Default false
    gamesHistory: [], // Empty array
    gamesSignUp: [], // Empty array
    languagePreference: 'en', // Default language
    paymentMethod: [], // Empty array
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  await db.collection('users').doc(userRecord.uid).set(userData);

  return { id: userRecord.uid, ...userData };
};

/**
 * Get all users
 * @returns {Promise<Array>} List of users
 */
export const getAllUsersModel = async () => {
  const usersSnapshot = await db.collection('users').get();
  const users = [];

  usersSnapshot.forEach((doc) => {
    users.push({ id: doc.id, ...doc.data() });
  });

  return users;
};

/**
 * Get a single user by UID
 * @param {string} uid
 * @returns {Promise<Object|null>} User data or null if not found
 */
export const getUserByIdModel = async (uid) => {
  const userDoc = await db.collection('users').doc(uid).get();
  if (!userDoc.exists) {
    return null;
  }
  return { id: userDoc.id, ...userDoc.data() };
};

/**
 * Get users by name
 * @param {string} name
 * @returns {Promise<Array>} List of user data or an empty array if not found
 */
export const getUserByNameModel = async (name) => {
  try {
    // console.log("Fetching users with name:", name); //for debugging
    const usersSnapshot = await db.collection('users').where('name', '==', name).get();
    const users = [];

    usersSnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });

    return users; // Return an array of users
  } catch (error) {
    console.error("Error fetching users by name:", error);
    return []; // Return an empty array in case of error
  }
};

/**
 * Update user role
 * @param {string} uid
 * @param {string} role
 * @returns {Promise<boolean>} True if updated, false if user not found
 */
export const updateRoleModel = async (uid, role) => {
  const userRef = db.collection('users').doc(uid);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    return false;
  }

  await userRef.update({ role, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
  return true;
};

/**
 * Update user details
 * @param {string} uid
 * @param {Object} updateData
 * @returns {Promise<boolean>} True if updated, false if user not found
 */
export const updateUserModel = async (uid, updateData) => {
  const userRef = db.collection('users').doc(uid);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    return false;
  }

  await userRef.update({ 
    ...updateData,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });

  return true;
};

/**
 * Delete user from Firebase Authentication and Firestore
 * @param {string} uid
 * @returns {Promise<boolean>} True if deleted, false if user not found
 */
export const deleteUserModel = async (uid) => {
  const userRef = db.collection('users').doc(uid);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    return false;
  }

  // Delete user from Authentication
  await admin.auth().deleteUser(uid);

  // Delete user from Firestore
  await userRef.delete();

  return true;
};

/**
 * Blacklist a user
 * @param {string} uid
 * @returns {Promise<boolean>} True if updated, false if user not found
 */
export const blacklistUserModel = async (uid) => {
  const userRef = db.collection('users').doc(uid);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    return false;
  }

  await userRef.update({
    blacklisted: true,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return true;
};

/**
 * Unblacklist a user
 * @param {string} uid
 * @returns {Promise<boolean>} True if updated, false if user not found
 */
export const unblacklistUserModel = async (uid) => {
  const userRef = db.collection('users').doc(uid);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    return false;
  }

  await userRef.update({
    blacklisted: false,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return true;
};
