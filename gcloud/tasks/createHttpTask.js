// Imports the Google Cloud Tasks library.
const { CloudTasksClient } = require("@google-cloud/tasks");

// Instantiates a client.
const client = new CloudTasksClient();

async function createHttpTask() {
    const project = "gmail-parser-386517";
    const queue = "my-queue";
    const location = "us-central1";
    const url = "https://webhook.site/39c83df7-885a-4107-b30f-609060d51711";
    const payload = "Hello, World!";
    const inSeconds = 10;

    // Construct the fully qualified queue name.
    const parent = client.queuePath(project, location, queue);

    const task = {
        httpRequest: {
            headers: {
                "Content-Type": "text/plain", // Set content type to ensure compatibility your application's request parsing
            },
            httpMethod: "POST",
            url,
        },
    };

    if (payload) {
        task.httpRequest.body = Buffer.from(payload).toString("base64");
    }

    if (inSeconds) {
        // The time when the task is scheduled to be attempted.
        task.scheduleTime = {
            seconds: parseInt(inSeconds) + Date.now() / 1000,
        };
    }

    // Send create task request.
    console.log("Sending task:");
    console.log(task);
    const request = { parent, task };
    const [response] = await client.createTask(request);
    console.log(`Created task ${response.name}`);
}
createHttpTask();
