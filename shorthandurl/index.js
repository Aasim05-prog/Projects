const express = require("express");
const path = require("path");
const app = express();
const urlRoute = require("./rout/url");
const Url = require("./model/url");
const { connectdb } = require("./connect");
const staticRouter = require("./rout/staticRouter");

const port = 9000;

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/url", urlRoute);       // Handles URL creation and analytics
app.use("/", staticRouter);      // Serves home page and static routes

// View engine setup for EJS templates
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// Optional test route to render home page with all URLs
app.get("/test", async (req, res) => {
  try {
    const allurl = await Url.find({});
    return res.render("home", { urls: allurl });
  } catch (err) {
    console.error("Error fetching URLs in /test:", err);
    return res.status(500).send("Internal Server Error");
  }
});

// Redirect route for short URLs, update visit history
app.get("/:shortid", async (req, res) => {
  try {
    const shortid = req.params.shortid;

    console.log("Redirecting shortid:", shortid);

    const entry = await Url.findOneAndUpdate(
      { shorturl: shortid },
      { $push: { visithistory: { timestamp: new Date() } } },
      { new: true }
    );

    if (!entry) {
      return res.status(404).send("Short URL not found");
    }

    return res.redirect(entry.originalUrl);
  } catch (err) {
    console.error("Redirection error:", err);
    return res.status(500).send("Internal Server Error");
  }
});

// Connect to MongoDB and start the Express server
connectdb("mongodb://localhost:27017/short-url")
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to DB:", err.message);
    process.exit(1);
  });
