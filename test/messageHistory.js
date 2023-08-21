const GmailAPI = require("../src/GmailAPI");

const historyID = 7715;

(async () => {
    try {
        // const { historyID } = await DB.getLast();

        const auth = await GmailAPI.authorize();
        const messageHistory = await GmailAPI.messageHistory(auth, historyID);

        console.log(messageHistory);
        console.log(messageHistory.history[0]?.messagesAdded);
        // const messageID = messageHistory.history[0].messages[0].id;

        // const message = await GmailAPI.getMessage(auth, messageID);

        // console.log(message);
    } catch (error) {
        console.error(error);
    }
})();
