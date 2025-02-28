import {
  getUserById,
  getGameById,
  addParticipantToGame,
  addToWaitlist,
  updateUserGames,
  finishGame,
} from "../models/playerModel.js";



export const joinGame = async (req, res) => {
  try {
    const { userId, gameId } = req.body;

    const user = await getUserById(userId);
    const game = await getGameById(gameId);

    if (!user || !game) {
      return res.status(404).json({ message: "User or Game not found" });
    }

    if (game.participants.length >= game.maxParticipants) {
      await addToWaitlist(gameId, {
        userId: userId,
        name: user.name,
      });
      return res
        .status(200)
        .json({ message: "Game is full. Added to waitlist." });
    }

    await addParticipantToGame(gameId, {
      userId: userId,
      name: user.name,
    });

    await updateUserGames(userId, gameId, "add");

    res.status(200).json({ message: "Successfully joined the game." });
  } catch (error) {
    console.error("Error joining game:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const leaveGame = async (req, res) => {
  try {
    const { gameId } = req.body;

    const game = await getGameById(gameId);
    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    for (const player of game.participants) {
      await updateUserGames(player.userId, gameId, "remove");
    }

    await finishGame(gameId);

    res.status(200).json({ message: "Game finished and users updated." });
  } catch (error) {
    console.error("Error finishing game:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
