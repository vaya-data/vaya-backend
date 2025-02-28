import { db ,admin} from "../config/firebaseAdmin.js";
/**
 * Fetch user data from Firestore by userId
 * @param {string} userId -  ID of the user
 * @param {string} gameId -  Id of the game
 * @returns {Promise<Object|null>} - Returns user data or null if not found
 */

//fetch by user id
export const getUserById = async (userId) => {
  const userRef = db.collection("users").doc(userId);
  const userSnap = await userRef.get();
  return userSnap.exists ? { id: userSnap.id, ...userSnap.data() } : null;
};
//fetch game by id
export const getGameById = async (gameId) => {
  const gameRef = db.collection("games").doc(gameId);
  const gameSnap = await gameRef.get();
  return gameSnap.exists ? { id: gameSnap.id, ...gameSnap.data() } : null;
};

//add user to game participants
export const addParticipantToGame = async (gameId, participant) => {
  return db
    .collection("games")
    .doc(gameId)
    .update({
      participants: admin.firestore.FieldValue.arrayUnion(participant),
    });
};

//add user to game wait list
export const addToWaitlist = async (gameId, user) => {
  return db
    .collection("games")
    .doc(gameId)
    .update({
      waitlist: admin.firestore.FieldValue.arrayUnion(user),
    });
};

// Update user game status (add/remove game from signup or history)
export const updateUserGames = async (userId, gameId, action) => {
  const userRef = db.collection("users").doc(userId);
  if (action === "add") {
    return userRef.update({
      gamesSignedUp: admin.firestore.FieldValue.arrayUnion(gameId),
    });
  } else if (action === "remove") {
    return userRef.update({
      gamesSignedUp: admin.firestore.FieldValue.arrayRemove(gameId),
      gamesHistory: admin.firestore.FieldValue.arrayUnion(gameId),
    });
  }
};
// Finish game and clear participant/waitlist data
export const finishGame = async (gameId) => {
  return db.collection("games").doc(gameId).update({
    participants: [],
    waitlist: [],
    status: "finished",
  });
};
