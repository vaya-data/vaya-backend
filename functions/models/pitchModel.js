import admin from "firebase-admin";

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

  const pitchRef = await admin.firestore().collection("pitches").add(newPitch);
  return { id: pitchRef.id, ...newPitch };
};

/**
 * Get all pitch data
 * @returns {Promise<Array>} List of pitches
 */
export const getPitchModel = async () => {
  const pitchSnapshot = await admin.firestore().collection("pitches").get();
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
  const pitchDoc = await admin.firestore().collection("pitches").doc(pitchId).get();
  if (!pitchDoc.exists) {
    return null;
  }
  return { id: pitchDoc.id, ...pitchDoc.data() };
};

/**
 * Update a pitch by ID
 * @param {string} pitchId
 * @param {Object} updateData
 * @returns {Promise<boolean>} True if updated, false if pitch not found
 */
export const updatePitchModel = async (pitchId, updateData) => {
  const pitchRef = admin.firestore().collection("pitches").doc(pitchId);
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
  const pitchRef = admin.firestore().collection("pitches").doc(pitchId);
  const pitchDoc = await pitchRef.get();

  if (!pitchDoc.exists) {
    return false;
  }

  await pitchRef.delete();
  return true;
};
