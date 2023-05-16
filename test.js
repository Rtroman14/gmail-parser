const GmailAPI = require("./src/GmailAPI");
const _ = require("./src/Helper");

(async () => {
    try {
        const auth = await GmailAPI.authorize();

        // const messages = await listMessages(auth, "label:inbox subject:Fwd: KML");
        // console.log(messages);

        const messageID = "188110210ea7fbdb";

        const message = await GmailAPI.getMessage(auth, messageID);

        const attachmentID = message.payload.parts[1].body.attachmentId;

        const attachment = await GmailAPI.getMessageAttachments(auth, messageID, attachmentID);

        const attachmentBuffer = _.decodeBase64(attachment.data);
        console.log(attachmentBuffer);

        // * watch
        // const response = await GmailAPI.watchTopic(auth, "gmail-parser");

        // console.log("Watch response:", response.data);
    } catch (error) {
        console.error(error);
    }
})();
