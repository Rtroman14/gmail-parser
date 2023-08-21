const axios = require("axios");
const xml2js = require("xml2js");
const GmailAPI = require("./src/GmailAPI");
const _ = require("./src/Helper");
const publishMessage = require("./src/publishMessage");

(async () => {
    const PUB_SUB_TOPIC = "helloPubSub";
    const HAIL_SIZE = 1.5;
    const WIND_SPEED = 60;
    let stormSwaths = [];

    try {
        const auth = await GmailAPI.authorize();

        // * LIST EMAILS
        const messages = await GmailAPI.listMessages(auth, "label:inbox");

        // * MODIFY EMAIL
        // const modify = await GmailAPI.modifyEmailLabel(auth, "1882ad5ab2b30800", ["UNREAD"]);
        // console.log(modify);

        // * MESSAGE HISTORY
        // const messageHistory = await GmailAPI.messageHistory(auth, 2569); // #1 - new email
        // const messageHistory = await GmailAPI.messageHistory(auth, 2576); // #2 - new email
        // console.log(messageHistory);
        // console.log(messageHistory.history[0].messages);
        // const messageID = messageHistory.history[0].messages[0].id;

        const messageID = "18a091c32ec0bb36";
        const message = await GmailAPI.getMessage(auth, messageID);
        const parts = message.payload.parts;

        const kmlAttachments = parts.filter(
            (part) => part.mimeType === "application/vnd.google-earth.kml+xml"
        );

        // * loop through attachments and parse kml contents
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

                // Extract the name attribute
                const name = result.kml.Document[0].name[0];

                let storms = result.kml.Document[0].Placemark;

                if (storms === undefined || !storms.length) {
                    return;
                }

                for (let storm of storms) {
                    const coordinates = _.fetchStormSwathsHailRecon(storm, HAIL_SIZE, WIND_SPEED);
                    coordinates && stormSwaths.push(coordinates);
                }
            });
        }

        console.log("check");

        stormSwaths = stormSwaths.map((swath) => ({ coordinates: swath }));
        stormSwaths = JSON.stringify(stormSwaths);

        await publishMessage(PUB_SUB_TOPIC, stormSwaths);
    } catch (error) {
        console.error(error);
    }
})();
