import { 
    addGameModel, 
    deleteGameModel, 
    getGameModel, 
    getGameByIdModel, 
    updateGameModel, 
} from "../models/gameModel.js";

/**
 * Add a new game
 */

export const addGame = async (req, res) => {
    try {
        const { 
            locationId,
            organizerId,
            amenities,
            startTime,  
            duration,
            participants = [],
            maxParticipants,
            reviews = [],
            format,
            gender,
            waitlist = [] 
        } = req.body;

        // Validate required fields
        if (!locationId || !organizerId || !amenities || !format || !gender || !maxParticipants  || !startTime || !duration) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Add game to Firestore
        const gameRecord = await addGameModel({
            locationId,
            organizerId,
            amenities,
            startTime,  
            duration,
            participants,
            maxParticipants,
            reviews,
            format,
            gender,
            waitlist
        });

        return res.status(201).json({
            message: "Game added successfully",
            gameId: gameRecord.id,
        });

    } catch (error) {
        console.error("Error adding game:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

/**
 * Get all games
 */
export const getGames = async (req, res) => {
    try {
        const gameData = await getGameModel();
        return res.status(200).json(gameData);
    } catch (error) {
        console.error("Error fetching games:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

/**
 * Get a single game by ID
 */
export const getGameById = async (req, res) => {
    try {
        const { id } = req.params;
        const game = await getGameByIdModel(id);

        if (!game) {
            return res.status(404).json({ error: "Game not found" });
        }

        return res.status(200).json(game);
    } catch (error) {
        console.error("Error fetching game:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

/**
 * Update a game by ID
 */
export const updateGame = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const updated = await updateGameModel(id, updateData);
        if (!updated) {
            return res.status(404).json({ error: "Game not found" });
        }

        return res.status(200).json({ message: "Game updated successfully" });
    } catch (error) {
        console.error("Error updating game:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

/**
 * Delete a game by ID
 */
export const deleteGame = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await deleteGameModel(id);

        if (!deleted) {
            return res.status(404).json({ error: "Game not found" });
        }

        return res.status(200).json({ message: "Game deleted successfully" });
    } catch (error) {
        console.error("Error deleting game:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
