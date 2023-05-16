const GmailAPI = require("./src/GmailAPI");

(async () => {
    try {
        const auth = await GmailAPI.authorize();

        const messages = await GmailAPI.listMessages(auth, "label:inbox subject:Fwd: KML");
        console.log(messages);
    } catch (error) {
        console.error(error);
    }
})();
