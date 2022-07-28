"use strict";
const mongoose = require("mongoose");
var Creater = mongoose.model("create");
var View = mongoose.model("view");
var Video = mongoose.model("video");
var fs = require("fs");
var multer = require("multer");
var jwt = require("jsonwebtoken");

var jwtkey = "jwt";

const createrUser = async (req, res) => {
  try {
    const data = {
      createrId: req.body.id,
      name: req.body.name,
      password: req.body.password,
      phoneNumber: req.body.phone,
      state: req.body.state,
      email: req.body.email,
    };

    const newUser = new Creater(data);
    const token = jwt.sign(data, jwtkey, {
      expiresIn: "5h",
    });
    console.log(token);
    const result = await newUser.save();
    res.send({ result: result, token: token });
  } catch (err) {
    console.log(err);
    res.send("Error", +err);
  }
};
const loginCreater = async (req, res) => {
  try {
    const data = await Creater.findOne({ email: req.body.email });
    console.log(data);
    if ((data.password = req.body.password)) {
      const token = jwt.sign(data, jwtkey, {
        expiresIn: "2h",
      });

      res.send(token);
    }
  } catch (err) {
    res.send("Error", +err);
  }
};
const insertViewer = async (req, res) => {
  try {
    const data = {
      name: req.body.name,
      password: req.body.password,
      email: req.body.email,
    };
    const newUser = new View(data);
    const token = jwt.sign(data, jwtkey, {
      expiresIn: "2h",
    });
    console.log(token);
    const result = await newUser.save();
    res.send({ result: result, token: token });
  } catch (err) {
    res.send("Error", +err);
  }
};
const loginView = async (req, res) => {
  try {
    const data = await View.findOne({ email: req.body.email });
    console.log(data);
    if ((data.password = req.body.password)) {
      const token = jwt.sign(data, jwtkey, {
        expiresIn: "2h",
      });

      res.send(token);
    }
  } catch (err) {
    res.send("Error", +err);
  }
};
const fetchAllVideo = async (req, res) => {
  try {
    const data = await Video.find();

    res.send(data);
  } catch (err) {
    res.send("Error", +err);
  }
};
const deleteOneVideo = async (req, res) => {
  try {
    const dirc = "data/video/";
    const data1 = await Video.findOne({ _id: req.body.id });
    console.log(data1);
    const data = await Video.deleteOne({ _id: req.body.id });
    console.log(data1.name);
    fs.unlinkSync(dirc + data1.name);
    console.log(data);
    console.log(data1);
    res.send(data1);
  } catch (err) {
    console.log(err);
    res.send("Error", +err);
  }
};
const fetchVCDetails = async (req, res) => {
  try {
    const data = await Video.findOne({ createrId: req.body.id });
    const data1 = await Creater.findOne({ createrId: req.body.id });
    let newArray = [data, data1];

    res.send(newArray);
  } catch (err) {
    res.send("Error", +err);
  }
};

const uploadFile = async (req, res) => {
  try {
    let dir = "data/video/";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    var storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, dir);
      },
      filename: function (req, file, cb) {
        console.log("file.originalname", file.originalname);
        var fileExtn = file.originalname.split(".").pop(-1);
        cb(null, new Date().getTime() + "." + fileExtn);
      },
    });

    var upload = multer({ storage: storage }).single("video");

    upload(req, res, async function (err) {
      const data = {
        createrId: req.body.createrId,
        name: req.file.filename,
        title: req.body.title,
        description: req.body.description,
        tags: req.body.tags,
        category: req.body.category,
      };
      console.log(data);
      const newUser = new Video(data);
      const result = await newUser.save();
      sendMail(result);
      console.log(result);
      res.send(newUser);
    });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

const sendMail = async (result1) => {
  console.log(result1);
  let user = await View.find();
  console.log(user);
  var handlebars = require("handlebars");
  var fs = require("fs");
  var readHTMLFile = function (path, callback) {
    fs.readFile(path, { encoding: "utf-8" }, function (err, html) {
      if (err) {
        throw err;
        callback(err);
      } else {
        callback(null, html);
      }
    });
  };
  var nodemailer = require("nodemailer");
  var smtpTransport = require("nodemailer-smtp-transport");

  var transporter = nodemailer.createTransport(
    smtpTransport({
      service: "gmail",
      auth: {
        user: "krishanindiit@gmail.com",
        pass: "juwnrejxqaximnve",
      },
    })
  );

  if (user.length === 0) return res.send({ status: false });

  user.forEach((key) => {
    readHTMLFile(
      __dirname + "/../templates/sendEmail.html",
      function (err, html) {
        var template = handlebars.compile(html);
        var replacements = {
          USER: key.name,
          link: `http://localhost:7011/videoproject/data/video/` + result1.name,
        };
        // console.log(user[i].name);

        var htmlToSend = template(replacements);
        var mailOptions = {
          from: "Dummy App <krishanindiit@gmail.com>",
          to: key.email,
          subject: "Email Account Confirmation",
          html: htmlToSend,
        };
        transporter.sendMail(mailOptions, function (error, response) {
          if (error) {
            console.log("email eror", error);
            //   res.send({
            //     msg: "Internal Server Error, Try again",
            //     status: 2,
            //     data: null,
            //   });
            // } else {
            //   // res.send({
            //   msg: "Your account has been registered",
            //   status: 1,
            // });
          }
        });
      }
    );
  });
};

exports.createrUser = createrUser;
exports.insertViewer = insertViewer;
exports.uploadFile = uploadFile;
exports.loginCreater = loginCreater;
exports.loginView = loginView;
exports.fetchAllVideo = fetchAllVideo;
exports.deleteOneVideo = deleteOneVideo;
exports.fetchVCDetails = fetchVCDetails;
