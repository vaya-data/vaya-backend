import admin from 'firebase-admin';

/**
 * Create a new user in Firebase Authentication and Firestore
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>} Created user record
 */
export const createUser = async (email, password) => {
  const userRecord = await admin.auth().createUser({
    email,
    password,
  });

  // Add user with default values to Firestore
  const userData = {
    uid: userRecord.uid,
    email,
    name: 'Anonymous', // Default name
    role: 'Player', // Default role
    blacklisted: false, // Default false
    gamesHistory: [], // Empty array
    gamesSignUp: [], // Empty array
    languagePreference: 'en', // Default language
    paymentMethod: [], // Empty array
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  await admin.firestore().collection('users').doc(userRecord.uid).set(userData);

  return { id: userRecord.uid, ...userData };
};

/**
 * Get all users
 * @returns {Promise<Array>} List of users
 */
export const getAllUsersModel = async () => {
  const usersSnapshot = await admin.firestore().collection('users').get();
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
  const userDoc = await admin.firestore().collection('users').doc(uid).get();
  if (!userDoc.exists) {
    return null;
  }
  return { id: userDoc.id, ...userDoc.data() };
};

/**
 * Update user role
 * @param {string} uid
 * @param {string} role
 * @returns {Promise<boolean>} True if updated, false if user not found
 */
export const updateRoleModel = async (uid, role) => {
  const userRef = admin.firestore().collection('users').doc(uid);
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
  const userRef = admin.firestore().collection('users').doc(uid);
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
  const userRef = admin.firestore().collection('users').doc(uid);
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
  const userRef = admin.firestore().collection('users').doc(uid);
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
  const userRef = admin.firestore().collection('users').doc(uid);
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
