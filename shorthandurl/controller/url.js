const shortid = require("shortid");
const Url = require("../model/url"); 

async function handlegenerateurl(req, res) {
  try {
    if (!req.body || !req.body.url) {
      return res.status(400).json({ error: "URL is required in request body" });
    }

    const { url: originalUrl } = req.body;
    console.log("Received originalUrl:", originalUrl);

    try {
      new URL(originalUrl);
    } catch (err) {
      return res.status(400).json({ error: "Invalid URL format" });
    }

    const shortIdValue = shortid();

    await Url.create({
      shorturl: shortIdValue,
      originalUrl,
      visithistory: [],
    });

    const allUrls = await Url.find({});

    return res.render("home", {
      id: shortIdValue,
      urls: allUrls,
    });

  } catch (err) {
    console.error("Detailed error generating short URL:", err);
    return res.status(500).json({
      error: "Something went wrong",
      details: err.message,
      errors: err.errors ? err.errors : undefined,
    });
  }
}

async function handleAnalytics(req, res) {
  try {
    const shortId = req.params.shortid;

    const result = await Url.findOne({ shorturl: shortId });

    if (!result) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    return res.json({
      totalClicks: result.visithistory.length,
      analytics: result.visithistory,
    });

  } catch (err) {
    console.error("Error fetching analytics:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
}

module.exports = {
  handlegenerateurl,
  handleAnalytics, 
};
