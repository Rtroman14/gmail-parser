const express = require("express");
const router = express.Router();

const { watch, stop, test, reset } = require("../controllers/gmail");

router.get("/watch", watch);
router.get("/stop", stop);
router.get("/reset", reset);

// router.post("/parse", parse);

router.post("/test", test);

module.exports = router;
