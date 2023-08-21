const GmailAPI = require("../src/GmailAPI");

(async () => {
    try {
        const auth = await GmailAPI.authorize();

        const response = await GmailAPI.watchTopic(auth, "gmail-parser");

        console.log("Watch response:", response.data);
    } catch (error) {
        console.error(error);
    }
})();
