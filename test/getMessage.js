const GmailAPI = require("../src/GmailAPI");

const messageID = "1886d94c8640f28f";

(async () => {
    try {
        const auth = await GmailAPI.authorize();

        const message = await GmailAPI.getMessage(auth, messageID);
        const { headers, parts } = message.payload;

        const from = headers.find((header) => header.name === "From");

        if (from.value.includes("ryan@peakleads.io")) {
            console.log("TRUEE");
        }
    } catch (error) {
        console.error(error);
    }
})();
