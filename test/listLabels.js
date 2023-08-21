const GmailAPI = require("../src/GmailAPI");

(async () => {
    try {
        const auth = await GmailAPI.authorize();

        await GmailAPI.listLabels(auth);
    } catch (error) {
        console.error(error);
    }
})();
