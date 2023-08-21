const GmailAPI = require("../src/GmailAPI");

(async () => {
    try {
        const auth = await GmailAPI.authorize();

        const response = await GmailAPI.stopWatch(auth);

        console.log("Stop response:", response);
    } catch (error) {
        console.error(error);
    }
})();
