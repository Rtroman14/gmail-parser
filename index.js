const express = require("express");

const gmailRouter = require("./routes/gmail");

const PORT = process.env.PORT || 8080;

const app = express();

// app.use(express.json({ limit: "50mb" }));

app.use("/gmail", gmailRouter);

app.get("/", (req, res) => {
    const name = process.env.NAME || "World";
    res.send(`Hello ${name}!`);
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
