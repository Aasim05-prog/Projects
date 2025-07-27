const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
  shorturl: {
    type: String,
    required: true,
    unique: true,
  },
  originalUrl: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        try {
          new URL(v);
          return true;
        } catch {
          return false;
        }
      },
      message: props => `${props.value} is not a valid URL!`,
    },
  },
  visithistory: [
    {
      timestamp: { type: Date, default: Date.now },
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model("Url", urlSchema);
