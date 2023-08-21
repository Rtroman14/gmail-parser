const fs = require("fs").promises;
const path = require("path");
const process = require("process");
const { authenticate } = require("@google-cloud/local-auth");
const { google } = require("googleapis");

const TOKEN_PATH = path.join(process.cwd(), "token.json");
const CREDENTIALS_PATH = path.join(process.cwd(), "credentials.json");

const SCOPES = [
    "https://mail.google.com/",
    "https://www.googleapis.com/auth/gmail.modify",
    "https://www.googleapis.com/auth/gmail.readonly",
];

// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.

class GmailAPI {
    loadSavedCredentialsIfExist = async () => {
        try {
            const content = await fs.readFile(TOKEN_PATH);
            const credentials = JSON.parse(content);
            return google.auth.fromJSON(credentials);
        } catch (err) {
            return null;
        }
    };

    saveCredentials = async (client) => {
        const content = await fs.readFile(CREDENTIALS_PATH);
        const keys = JSON.parse(content);
        const key = keys.installed || keys.web;
        const payload = JSON.stringify({
            type: "authorized_user",
            client_id: key.client_id,
            client_secret: key.client_secret,
            refresh_token: client.credentials.refresh_token,
        });
        await fs.writeFile(TOKEN_PATH, payload);
    };

    authorize = async () => {
        let client = await this.loadSavedCredentialsIfExist();
        if (client) {
            return client;
        }
        client = await authenticate({
            scopes: SCOPES,
            keyfilePath: CREDENTIALS_PATH,
        });
        if (client.credentials) {
            await this.saveCredentials(client);
        }
        return client;
    };

    listLabels = async (auth) => {
        const gmail = google.gmail({ version: "v1", auth });
        const res = await gmail.users.labels.list({
            userId: "me",
        });
        const labels = res.data.labels;
        if (!labels || labels.length === 0) {
            console.log("No labels found.");
            return;
        }
        console.log("Labels:");
        labels.forEach((label) => {
            console.log(`- ${label.name}`);
        });
    };

    listMessages = async (auth, query) => {
        try {
            const gmail = google.gmail({ version: "v1", auth });
            const res = await gmail.users.messages.list({
                userId: "me",
                q: query,
            });

            if (!res.data.messages) {
                return [];
            }

            return res.data.messages;
        } catch (err) {
            throw err;
        }
    };

    getMessage = async (auth, id) => {
        try {
            const gmail = google.gmail({ version: "v1", auth });
            const res = await gmail.users.messages.get({
                userId: "me",
                id,
            });

            return res.data;
        } catch (err) {
            throw err;
        }
    };

    modifyEmailLabel = async (auth, id, removeLabelIds = ["UNREAD"]) => {
        try {
            const gmail = google.gmail({ version: "v1", auth });
            const res = await gmail.users.messages.modify({
                id,
                userId: "me",
                requestBody: {
                    removeLabelIds,
                },
            });

            return res.data;
        } catch (err) {
            throw err;
        }
    };

    messageHistory = async (auth, historyId) => {
        try {
            const gmail = google.gmail({ version: "v1", auth });
            const res = await gmail.users.history.list({
                userId: "me",
                startHistoryId: Number(historyId),
                historyTypes: ["messageAdded"],
                // historyTypes: ["messageAdded", "labelAdded"],
            });

            return res.data;
        } catch (err) {
            throw err;
        }
    };

    getMessageAttachments = async (auth, messageId, id) => {
        try {
            const gmail = google.gmail({ version: "v1", auth });
            const res = await gmail.users.messages.attachments.get({
                userId: "me",
                messageId,
                id,
            });

            return res.data;
        } catch (err) {
            throw err;
        }
    };

    watchTopic = async (auth, topic) => {
        const gmail = google.gmail({ version: "v1", auth });

        // Replace with your Pub/Sub topic name
        const response = await gmail.users.watch({
            userId: "me",
            requestBody: {
                topicName: `projects/gmail-parser-386517/topics/${topic}`,
                labelFilterAction: "include",
                // labelIds: ["INBOX"], // Set the labels you want to watch (INBOX, SENT, etc.)
                labelIds: ["UNREAD"], // Set the labels you want to watch (INBOX, SENT, etc.)
            },
        });

        return response;
    };

    stopWatch = async (auth) => {
        const gmail = google.gmail({ version: "v1", auth });

        const response = await gmail.users.stop({
            userId: "me",
        });

        return response;
    };
}

module.exports = new GmailAPI();
