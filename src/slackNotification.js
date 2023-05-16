require("dotenv").config();

const axios = require("axios");

module.exports = async (username, text, channel) => {
    const channels = [
        {
            text,
            username,
            icon_emoji: ":warning:",
            unfurl_links: true,
            channel: "#error-alerts",
        },
        {
            text,
            username,
            icon_emoji: ":mailbox_with_mail:",
            unfurl_links: true,
            channel: "#email-notifications",
        },
        {
            text: "Error",
            username,
            icon_emoji: ":thunder_cloud_and_rain:",
            unfurl_links: false,
            channel: "#weather-alerts",
            blocks: text,
        },
        {
            text,
            username,
            icon_emoji: ":moneybag:",
            unfurl_links: true,
            channel: "#automationexperts",
        },
        {
            text,
            username,
            icon_emoji: ":moneybag:",
            unfurl_links: true,
            channel: "#app-testing",
        },
    ];

    const payload = channels.find((el) => el.channel === channel);

    try {
        await axios.post(process.env.SLACK_CHANNELS, payload);
    } catch (error) {
        console.log("slackNotification() --", error);
    }
};
