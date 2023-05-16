const express = require("express");
const router = express.Router();

const { watch, parse, test } = require("../controllers/gmail");

router.get("/watch", watch);
router.post("/parse", parse);
router.post("/test", test);

module.exports = router;
