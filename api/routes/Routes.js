"use strict";
module.exports = function (app) {
  var creater = require("../controllers/usercontroll");
  var viewer = require("../controllers/usercontroll");
  var upload = require("../controllers/usercontroll");
  app.route("/createUser").post(creater.createrUser);
  app.route("/addViewer").post(viewer.insertViewer);
  
  app.route("/upload").post(upload.uploadFile);
  app.route("/createrLogin").post(upload.loginCreater);
  app.route("/viewerLogin").post(upload.loginView);
  app.route("/fetchAllVideo").post(upload.fetchAllVideo);
  app.route("/deleteOnevideo").delete(upload.deleteOneVideo);
  app.route("/fetchVCDetails").post(upload.fetchVCDetails);
};
