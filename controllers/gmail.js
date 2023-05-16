const slackNotification = require("../src/slackNotification");
const GmailAPI = require("../src/GmailAPI");
const _ = require("../src/Helper");

const watch = async (req, res, next) => {
    try {
        const auth = await GmailAPI.authorize();

        const response = await GmailAPI.watchTopic(auth, "gmail-parser");

        console.log("Watch response:", response.data);

        res.json({ response });
    } catch (error) {
        console.log("Gmail > watch", error);
        console.error(`Gmail > watch -- ${JSON.stringify(error.message)}`);
    }
};

const parse = async (req, res, next) => {
    console.log(`req.body: ${req.body}`);

    try {
        const auth = await GmailAPI.authorize();

        const messages = await GmailAPI.listMessages(auth, "label:inbox");
        console.log(messages);

        // TODO: fetch inbox
        // TODO: if attachment -->
        // TODO:    loop through attachements
        // TODO:    if kml -->
        // TODO:        parse content
        // TODO:        if storm meets criteria -->
        // TODO:            send coordinates to task

        res.json({ messages });
    } catch (error) {
        console.log("Gmail > parse", error);
        console.error(`Gmail > parse -- ${JSON.stringify(error.message)}`);
    }
};

const test = async (req, res, next) => {
    console.log(`Body: ${req.body}`);

    res.json({ body: req.body });
};

module.exports = { watch, parse, test };
