const mongoose = require("mongoose");

async function connectdb(url) {
    try {
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(" Connected to MongoDB");
    } catch (err) {
        console.error(" MongoDB connection error:", err.message);
        process.exit(1);
    }
}

module.exports = {
    connectdb,
};
