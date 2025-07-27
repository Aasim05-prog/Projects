const express = require("express");
const Url = require("../model/url");  
const staticRouter = express.Router();

staticRouter.get("/", async (req, res) => {
    try {
        const allur = await Url.find({});
        return res.render("home", { urls: allur });  
    } catch (err) {
        console.error("Error fetching URLs:", err);
        return res.status(500).send("Internal Server Error");
    }
});

module.exports = staticRouter;
