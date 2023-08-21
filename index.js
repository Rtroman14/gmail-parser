const express = require("express");

const gmailRouter = require("./routes/gmail");
const scraperRouter = require("./routes/scraper");

const PORT = process.env.PORT || 8080;

const app = express();
app.use(express.json());

// app.use(express.json({ limit: "50mb" }));

app.use("/gmail", gmailRouter);
app.use("/scraper", scraperRouter);

app.get("/", (req, res) => {
    const name = process.env.NAME || "World";
    res.send(`Hello ${name}!`);
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
