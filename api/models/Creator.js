"use strict";
var mongoose = require("mongoose");

//INSERT USER
var createrSchema = new mongoose.Schema(
  {
    createrId: { type: Number, required: true },
    name: { type: String, required: true },
    password: { type: String },
    phoneNumber: { type: Number },
    state: { type: String, default: null },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      required: [true, "Email is required"],
    },
    token: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("create", createrSchema);
