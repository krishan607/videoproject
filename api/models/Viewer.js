"use strict";

var mongoose = require("mongoose");

var viewerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, lowercase: true, trim: true, required: true },
    password: { type: String, required: true },
    token: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("view", viewerSchema);
