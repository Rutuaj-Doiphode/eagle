const express = require("express");
const router = express.Router();
const request = require("request");
const nodemailer = require("nodemailer");
const config = require("../config/config.json");

router.get("/monitor", async (req, res) => {
  let failedUrls = [];
  try {
    config.team_name.forEach((team) => {
      team.urls_to_monitor.forEach((item, index) => {
        request(
          {
            url: item.url,
            timeout: 10000,
            followRedirect: true,
            maxRedirects: 10,
          },
          (err, res) => {
            if (res && res.statusCode === 200) {
              console.log(item, "--->", res.statusCode);
            } else {
              failedUrls.push(item);
              if (index === team.urls_to_monitor.length - 1) {
                if (failedUrls.length > 0) {
                  triggerNotification(failedUrls);
                }
              }
            }
          }
        );
      });
    });

    res.send("success");
  } catch (error) {
    console.log(error);
  }
});

// async..await is not allowed in global scope, must use a wrapper
const triggerNotification = async (items) => {
  let users = config.team_name[0].notification.toString();
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "dipayanpalit15@gmail.com",
      pass: "juehhrxovikbvdqe",
    },
  });
  let body = "";
  items.forEach((item) => {
    body = body + `${item.name} : ${item.url} is down <br>`;
  });

  var mailOptions = {
    from: "Dipayan Palit <dipayanpalit15@gmail.com>",
    to: users,
    subject: "Service Status",
    html: body,
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
