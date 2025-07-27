const express = require("express");
const { handlegenerateurl, handleAnalytics } = require("../controller/url");

const router = express.Router();
router.post('/', handlegenerateurl);
router.get('/analytics/:shortid', handleAnalytics);

module.exports = router;
