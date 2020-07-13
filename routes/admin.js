const express = require("express");
const route = express.Router();
const adminCheck = require("../middleware/adminCheck.js");

route.get("/", adminCheck.verify, async (req, res, next) => {
  res.render("admin-home", function (err, html) {
    if (err) {
      next();
    } else {
      res.send(html);
    }
  });
});

route.post(
  "/login",
  express.urlencoded({ extended: true }),
  async (req, res, next) => {
    let username = req.body.username || null;
    let password = req.body.password || null;
    if (
      username === process.env.adminName &&
      password === process.env.adminPass
    ) {
      req.session.role = "admin";
      req.session.save(function (err) {
        if (err) {
          next(err);
        } else {
          res.redirect("/admin");
        }
      });
    } else {
      res.redirect("/login");
    }
  }
);

route.get("/logout", adminCheck.verify, async (req, res, next) => {
  req.session.role = undefined;
  await req.session.save();
  res.redirect("/login");
});

module.exports = route;
