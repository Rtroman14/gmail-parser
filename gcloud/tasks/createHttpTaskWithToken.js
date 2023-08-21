// Imports the Google Cloud Tasks library.
const { CloudTasksClient } = require("@google-cloud/tasks");

// Instantiates a client.
const client = new CloudTasksClient();

async function createHttpTaskWithToken(taskNum) {
    const project = "gmail-parser-386517";
    const queue = "reonomy-scraper-coordinates-test";
    const location = "us-central1";
    const url = "https://reonomy-scraper-tachibv3cq-uc.a.run.app";
    const serviceAccountEmail = "reonomy-scraper@gmail-parser-386517.iam.gserviceaccount.com";
    const payload = JSON.stringify({ taskNum });

    // Construct the fully qualified queue name.
    const parent = client.queuePath(project, location, queue);

    const task = {
        httpRequest: {
            headers: {
                "Content-Type": "text/plain", // Set content type to ensure compatibility your application's request parsing
            },
            httpMethod: "POST",
            url,
            oidcToken: {
                serviceAccountEmail,
            },
        },
    };

    if (payload) {
        task.httpRequest.body = Buffer.from(payload).toString("base64");
    }

    console.log("Sending task:");
    // console.log(task);

    // Send create task request.
    const request = { parent, task };
    const [response] = await client.createTask(request);
    const name = response.name;
    console.log(`Created task ${name}`);
}
// createHttpTaskWithToken("1");

(async () => {
    try {
        const tasks = [1, 2, 3, 4, 5];

        for (let task of tasks) {
            await createHttpTaskWithToken(String(task));
        }

        // const tasksReq = tasks.map((task) => createHttpTaskWithToken(String(task)));

        // await Promise.all(tasksReq);
    } catch (error) {
        console.error(error);
    }
})();
