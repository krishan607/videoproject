"use strict";
var mongoose = require("mongoose");

var videoSchema = new mongoose.Schema(
  {
    createrId: { type: Number, required: true },
    name: { type: String },
    title: { type: String },
    description: { type: String },
    tags: { type: String },
    category: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("video", videoSchema);
