const express = require("express");
const router = express.Router();

const { reonomy } = require("../controllers/scraper");

router.post("/reonomy", reonomy);

module.exports = router;
