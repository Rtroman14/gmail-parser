const _ = require("../src/Helper");

const data = "eyJlbWFpbEFkZHJlc3MiOiJhdXRvbWF0aW9uQHBlYWtsZWFkcy5pbyIsImhpc3RvcnlJZCI6NjM4NH0=";

(async () => {
    try {
        const decodedMessage = _.decodeBase64(data);
        const { historyId } = JSON.parse(decodedMessage);

        console.log(historyId);
    } catch (error) {
        console.error(error);
    }
})();
