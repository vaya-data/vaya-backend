import { db , admin} from "../config/firebaseAdmin.js";

/**
 * Add a pitch to Firestore
 * @param {Object} pitchData
 * @returns {Promise<Object>} Pitch reference
 */
export const addPitchModel = async ({ address, gmaplink, pitchname, type }) => {
  const newPitch = {
    location: {
      address,
      gMapLink: gmaplink,
    },
    name: pitchname,
    type,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  const pitchRef = await db.collection("pitches").add(newPitch);
  return { id: pitchRef.id, ...newPitch };
};
  
/**
 * Get all pitch data
 * @returns {Promise<Array>} List of pitches
 */
export const getPitchModel = async () => {
  const pitchSnapshot = await db.collection("pitches").get();
  const pitchData = [];

  pitchSnapshot.forEach((doc) => {
    pitchData.push({ id: doc.id, ...doc.data() });
  });

  return pitchData;
};

/**
 * Get a single pitch by ID
 * @param {string} pitchId
 * @returns {Promise<Object|null>} Pitch data or null if not found
 */
export const getPitchByIdModel = async (pitchId) => {
  const pitchDoc = await db.collection("pitches").doc(pitchId).get();
  if (!pitchDoc.exists) {
    return null;
  }
  return { id: pitchDoc.id, ...pitchDoc.data() };
};


/**
 * Get pitches by name
 * @param {string} name
 * @returns {Promise<Array>} List of pitch data or an empty array if not found
 */
export const getPitchByNameModel = async (name) => {
  try {
    // console.log("Fetching Pitch with name:", name); //for debugging
    const pitchesSnapshot = await db.collection('pitches').where('name', '==', name).get();
    const pitches = [];

    pitchesSnapshot.forEach((doc) => {
      pitches.push({ id: doc.id, ...doc.data() });
    });

    return pitches; // Return an array of pitches
  } catch (error) {
    console.error("Error fetching pitches by name:", error);
    return []; // Return an empty array in case of error
  }
};

/**
 * Update a pitch by ID
 * @param {string} pitchId
 * @param {Object} updateData
 * @returns {Promise<boolean>} True if updated, false if pitch not found
 */
export const updatePitchModel = async (pitchId, updateData) => {
  const pitchRef = db.collection("pitches").doc(pitchId);
  const pitchDoc = await pitchRef.get();

  if (!pitchDoc.exists) {
    return false;
  }

  await pitchRef.update({
    ...updateData,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return true;
};

/**
 * Delete a pitch by ID
 * @param {string} pitchId
 * @returns {Promise<boolean>} True if deleted, false if pitch not found
 */
export const deletePitchModel = async (pitchId) => {
  const pitchRef = db.collection("pitches").doc(pitchId);
  const pitchDoc = await pitchRef.get();

  if (!pitchDoc.exists) {
    return false;
  }

  await pitchRef.delete();
  return true;
};
