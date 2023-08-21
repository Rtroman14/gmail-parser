const { initializeApp, applicationDefault, cert } = require("firebase-admin/app");
const { getFirestore, Timestamp, FieldValue } = require("firebase-admin/firestore");

const serviceAccount = require("../serviceAccountKey.json");

const HISTORY_ID_COLLECTION = "historyIds";

initializeApp({
    credential: cert(serviceAccount),
});

const db = getFirestore();

const collectionRef = db.collection(HISTORY_ID_COLLECTION);

const historyId = "345";

(async () => {
    try {
        const res = await collectionRef.doc(historyId).set({ historyId: Number(historyId) });

        console.log(res);
    } catch (error) {
        console.error(error);
    }
})();
