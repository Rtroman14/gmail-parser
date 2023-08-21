const { getFirestore } = require("firebase-admin/firestore");

const HISTORY_ID_COLLECTION = "historyIds";

class Firebase {
    lastHistoryID = async () => {
        try {
            const db = getFirestore();
            const collectionRef = db.collection(HISTORY_ID_COLLECTION);
            const snapshot = await collectionRef.orderBy("historyId", "desc").limit(1).get();

            let historyId;
            snapshot.forEach((doc) => {
                const document = doc.data();

                historyId = document.historyId;
            });

            return historyId;
        } catch (error) {
            console.error(`Firebase.lastHistoryID() -- ${error.message}`);

            return false;
        }
    };

    addHistoryID = async (historyId) => {
        try {
            const db = getFirestore();
            const collectionRef = db.collection(HISTORY_ID_COLLECTION);

            const newHistoryID = await collectionRef
                .doc(String(historyId))
                .set({ historyId: Number(historyId) });

            return newHistoryID;
        } catch (error) {
            console.error(`Firebase.addHistoryID() -- ${error.message}`);

            return false;
        }
    };
}

module.exports = new Firebase();
