import { 
  addPitchModel, 
  getPitchModel, 
  getPitchByIdModel, 
  updatePitchModel, 
  deletePitchModel, 
  getPitchByNameModel
} from "../models/pitchModel.js";

/**
 * Add a new pitch
 * @route POST /addpitch
 */
export const addPitch = async (req, res) => {
  try {
    const { address, gmaplink, pitchname, type } = req.body;

    if (!address || !gmaplink || !pitchname || !type) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Add pitch to Firestore
    const pitchRecord = await addPitchModel({ address, gmaplink, pitchname, type });

    return res.status(201).json({
      message: "Pitch added successfully",
      pitchId: pitchRecord.id,
    });

  } catch (error) {
    console.error("Error adding pitch:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Get all pitches
 * @route GET /getpitches
 */
export const getPitches = async (req, res) => {
  try {
    const pitchData = await getPitchModel();
    return res.status(200).json(pitchData);
  } catch (error) {
    console.error("Error fetching pitches:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Get a single pitch by ID
 * @route GET /getpitch/:id
 */
export const getPitchById = async (req, res) => {
  try {
    const { id } = req.params;
    const pitch = await getPitchByIdModel(id);

    if (!pitch) {
      return res.status(404).json({ error: "Pitch not found" });
    }

    return res.status(200).json(pitch);
  } catch (error) {
    console.error("Error fetching pitch:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


/**
 * Get a single pitch by name
 * @route GET /getpitch/name/:name
 */
export const getPitchByName = async (req, res) => {
  try {
    const { name } = req.params;
    const pitch = await getPitchByNameModel(name);

    if (!pitch) {
      return res.status(404).json({ error: "pitch not found" });
    }

    return res.status(200).json(pitch);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Update a pitch by ID
 * @route PUT /updatepitch/:id
 */
export const updatePitch = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!Object.keys(updateData).length) {
      return res.status(400).json({ error: "Update data is required" });
    }

    const updated = await updatePitchModel(id, updateData);

    if (!updated) {
      return res.status(404).json({ error: "Pitch not found" });
    }

    return res.status(200).json({ message: "Pitch updated successfully" });
  } catch (error) {
    console.error("Error updating pitch:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Delete a pitch by ID
 * @route DELETE /deletepitch/:id
 */
export const deletePitch = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await deletePitchModel(id);

    if (!deleted) {
      return res.status(404).json({ error: "Pitch not found" });
    }

    return res.status(200).json({ message: "Pitch deleted successfully" });
  } catch (error) {
    console.error("Error deleting pitch:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
