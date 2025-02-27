import { db } from "../config/firebaseAdmin.js";

/**
 * Add a game to Firestore
 * @param {Object} gameData
 * @returns {Promise<Object>} Game reference
 */
export const addGameModel = async ({
    locationId,
    organizerId,
    amenities,
    participants = [],
    maxParticipants,
    reviews = [],
    format,
    gender,
    waitlist = [],
}) => {
    try {
        // Determine the status based on participants count
        const status = participants.length >= maxParticipants ? "inactive" : "active";
        const newGame = {
            locationId,
            organizerId,
            amenities,
            participants,
            maxParticipants,
            reviews,
            status,
            type: { format, gender },
            waitlist,
            createdAt: admin.firestore.FieldValue.serverTimestamp(), // Track creation time
        };

        const gameRef = await db.collection("games").add(newGame);
        return { id: gameRef.id, ...newGame };
    } catch (error) {
        console.error("Error adding game:", error);
        throw new Error("Failed to add game");
    }
};

/**
 * Retrieve all games from Firestore
 * @returns {Promise<Array>} Array of game objects
 */
export const getGameModel = async () => {
    try {
        const gameSnapshot = await db.collection("games").get();
        const gameData = [];

        gameSnapshot.forEach((doc) => {
            gameData.push({ id: doc.id, ...doc.data() });
        });

        return gameData;
    } catch (error) {
        console.error("Error fetching games:", error);
        throw new Error("Failed to retrieve games");
    }
};

/**
 * Retrieve a single game by ID
 * @param {string} gameId
 * @returns {Promise<Object|null>} Game object or null if not found
 */
export const getGameByIdModel = async (gameId) => {
    try {
        const gameDoc = await db.collection("games").doc(gameId).get();
        if (!gameDoc.exists) {
            return null;
        }
        return { id: gameDoc.id, ...gameDoc.data() };
    } catch (error) {
        console.error("Error fetching game by ID:", error);
        throw new Error("Failed to retrieve game");
    }
};

/**
 * Retrieve a game by name
 * @param {string} gameName
 * @returns {Promise<Array>} Array of matching games
 */
export const getGameByNameModel = async (gameName) => {
    try {
        const gameSnapshot = await db.collection("games").where("name", "==", gameName).get();
        const games = [];

        if (gameSnapshot.empty) {
            return games;
        }

        gameSnapshot.forEach((doc) => {
            games.push({ id: doc.id, ...doc.data() });
        });

        return games;
    } catch (error) {
        console.error("Error fetching game by name:", error);
        throw new Error("Failed to retrieve game by name");
    }
};

/**
 * Update a game by ID
 * @param {string} gameId
 * @param {Object} updateData
 * @returns {Promise<boolean>} True if updated, false if game not found
 */
export const updateGameModel = async (gameId, updateData) => {
    try {
        const gameRef = db.collection("games").doc(gameId);
        const gameDoc = await gameRef.get();

        if (!gameDoc.exists) {
            return false;
        }

        await gameRef.update({
            ...updateData,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(), // Fixed syntax error
        });

        return true;
    } catch (error) {
        console.error("Error updating game:", error);
        throw new Error("Failed to update game");
    }
};

/**
 * Delete a game by ID
 * @param {string} gameId
 * @returns {Promise<boolean>} True if deleted, false if game not found
 */
export const deleteGameModel = async (gameId) => {
    try {
        const gameRef = db.collection("games").doc(gameId);
        const gameDoc = await gameRef.get();

        if (!gameDoc.exists) {
            return false;
        }

        await gameRef.delete();
        return true;
    } catch (error) {
        console.error("Error deleting game:", error);
        throw new Error("Failed to delete game");
    }
};

