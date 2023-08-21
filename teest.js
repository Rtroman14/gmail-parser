const { initializeApp, applicationDefault, cert } = require("firebase-admin/app");
const { getFirestore, Timestamp, FieldValue } = require("firebase-admin/firestore");

const serviceAccount = require("./serviceAccountKey.json");

initializeApp({
    credential: cert(serviceAccount),
});

const db = getFirestore();

const COLLECTION = "emailHistory";

const collectionRef = db.collection(COLLECTION);

(async () => {
    try {
        const snapshot = await collectionRef.orderBy("historyId", "desc").limit(1).get();

        let historyId;

        snapshot.forEach((doc) => {
            const document = doc.data();

            historyId = document.historyId;
            console.log(doc.id, "=>", doc.data());
        });

        console.log("last historyId:", historyId);
    } catch (error) {
        console.error(error);
    }
})();
