const xml2js = require("xml2js");
const axios = require("axios");
// const slackNotification = require("../src/slackNotification");
const GmailAPI = require("../src/GmailAPI");
const _ = require("../src/Helper");
const Firebase = require("../src/Firebase");
// const publishMessage = require("../src/publishMessage");

const { reonomy } = require("../controllers/scraper");

const { initializeApp, applicationDefault } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

initializeApp({
    credential: applicationDefault(),
});

const FROM_EMAIL = "ryan@peakleads.io";
const HAIL_SIZE = 1.5;
const WIND_SPEED = 60;

const watch = async (req, res, next) => {
    try {
        const auth = await GmailAPI.authorize();

        const response = await GmailAPI.watchTopic(auth, "gmail-parser");

        console.log("Watch response:", response.data);

        const { historyId } = response.data;

        const newHistoryID = await Firebase.addHistoryID(historyId);

        return res.json({ newHistoryID });
    } catch (error) {
        console.error(`Gmail > watch -- ${JSON.stringify(error.message)}`);

        return res.status(500).send({ data: undefined, message: error.message });
    }
};

const reset = async (req, res) => {
    try {
        const auth = await GmailAPI.authorize();

        const stopResponse = await GmailAPI.stopWatch(auth);

        const watchResponse = await GmailAPI.watchTopic(auth, "gmail-parser");

        console.log("Watch response:", watchResponse.data);

        const { historyId } = watchResponse.data;

        const newHistoryID = await Firebase.addHistoryID(historyId);

        return res.json({ newHistoryID });
    } catch (error) {
        console.error(`Gmail > reset -- ${JSON.stringify(error.message)}`);

        return res.status(500).send({ data: undefined, message: error.message });
    }
};

const stop = async (req, res) => {
    try {
        const auth = await GmailAPI.authorize();

        const response = await GmailAPI.stopWatch(auth);

        console.log("Stop response:", JSON.stringify(response));

        return res.json({ response });
    } catch (error) {
        console.error(`Gmail > stop -- ${JSON.stringify(error.message)}`);

        return res.status(500).send({ data: undefined, message: error.message });
    }
};

const test = async (req, res, next) => {
    let stormSwaths = [];

    let numAttachments = undefined;

    if (!req.body) {
        const msg = "no Pub/Sub message received";
        console.error(`error: ${msg}`);
        res.status(400).send(`Bad Request: ${msg}`);
        return;
    }
    if (!req.body.message) {
        const msg = "invalid Pub/Sub message format";
        console.error(`error: ${msg}`);
        res.status(400).send(`Bad Request: ${msg}`);
        return;
    }

    const decodedMessage = _.decodeBase64(req.body.message.data);
    const { historyId } = JSON.parse(decodedMessage);

    const lastHistoryID = await Firebase.lastHistoryID();
    if (!lastHistoryID) {
        console.error("no lastHistoryID");
        return res.status(204).send({ message: "no lastHistoryID" });
    }

    const auth = await GmailAPI.authorize();
    const messageHistory = await GmailAPI.messageHistory(auth, lastHistoryID);
    if (messageHistory) {
        await Firebase.addHistoryID(messageHistory.historyId);
    }

    await Firebase.addHistoryID(historyId);

    console.log("messageHistory:", messageHistory);

    if (!("history" in messageHistory)) {
        console.error(`"history" not in messageHistory`);
        return res.status(204).send({ message: `"history" not in messageHistory` });
    }

    const messageID = messageHistory.history[0]?.messagesAdded[0]?.message.id;
    const gmailMessage = await GmailAPI.getMessage(auth, messageID);
    const { headers, parts } = gmailMessage.payload;

    const from = headers.find((header) => header.name === "From");
    if (!from.value.includes(FROM_EMAIL)) {
        console.error(`Incoming email isn't from ${FROM_EMAIL}`);
        return res.status(204).send({ message: `Incoming email isn't from ${FROM_EMAIL}` });
    }

    console.log("gmailMessage:", gmailMessage);

    const kmlAttachments = parts.filter(
        (part) => part.mimeType === "application/vnd.google-earth.kml+xml"
    );

    if (!kmlAttachments.length) {
        console.error("No KML attachments");
        return res.status(204).send({ data: undefined, message: "No KML attachments" });
    }

    numAttachments = String(kmlAttachments.length);

    try {
        // * loop through attachments, parse, kml, return storm swaths
        for (let kmlAttachment of kmlAttachments) {
            const attachmentID = kmlAttachment.body.attachmentId;

            const attachment = await GmailAPI.getMessageAttachments(auth, messageID, attachmentID);

            const kmlData = _.decodeBase64(attachment.data);

            // Parse the KML data
            xml2js.parseString(kmlData, (err, result) => {
                if (err) {
                    console.error(err);
                    return;
                }

                const name = result.kml.Document[0].name[0];
                let storms = result.kml.Document[0].Placemark;

                if (storms === undefined || !storms.length) {
                    return;
                }

                for (let storm of storms) {
                    const coordinates = _.fetchStormSwaths(storm, HAIL_SIZE, WIND_SPEED);
                    coordinates && stormSwaths.push(coordinates);
                }
            });
        }

        // console.log("stormSwaths:", stormSwaths);

        res.status(204).send({ message: stormSwaths });

        if (stormSwaths.length) {
            reonomy(stormSwaths);
        }
    } catch (error) {
        console.error(`Gmail > parse -- ${JSON.stringify(error.message)}`);

        return res.status(500).send({ data: undefined, message: error.message });
    }
};

module.exports = { watch, stop, test, reset };

// * publish message
// stormSwaths = stormSwaths.map((swath) => ({ coordinates: swath }));
// const stormSwathsStringify = JSON.stringify(stormSwaths);

// const messageID = await publishMessage(PUB_SUB_TOPIC, stormSwathsStringify);

// res.status(204).send({
//     data: { messageID },
//     message: `${stormSwaths.length} storm swaths sent via Pub/Sub message: ${messageID}`,
// });
