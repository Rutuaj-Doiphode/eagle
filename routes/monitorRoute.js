const express = require("express");
const router = express.Router();
const request = require("request");
const nodemailer = require("nodemailer");
const config = require("../config/config.json");

router.get("/monitor", async (req, res) => {
  try {
    config.team_name.forEach((team) => {
      team.urls_to_monitor.forEach((item) => {
        request(item.url, (err, res) => {
          if (res && res.statusCode === 200) {
            console.log(item, "--->", res.statusCode);
          } else {
            triggerNotification(item, team.notification);
          }
        });
      });
    });
    res.send("success");
  } catch (error) {
    console.log(error);
  }
});

// async..await is not allowed in global scope, must use a wrapper
const triggerNotification = async (item, recipients) => {
  let users = recipients.toString();
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "dipayanpalit15@gmail.com",
      pass: "juehhrxovikbvdqe",
    },
  });

  var mailOptions = {
    from: "Dipayan Palit <dipayanpalit15@gmail.com>",
    to: users,
    subject: "Service Status",
    text: `${item.name} : ${item.url} is down`,
  };
  // console.log(item);

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = router;
