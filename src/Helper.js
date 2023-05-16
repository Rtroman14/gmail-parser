class Helpers {
    decodeBase64 = (encodedData) => {
        const attachmentBuffer = Buffer.from(encodedData, "base64");

        return attachmentBuffer.toString("utf-8");
    };
}

module.exports = new Helpers();
