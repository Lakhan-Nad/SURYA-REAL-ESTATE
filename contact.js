const express = require("express");
const Contact = require("./database/models/contacts.model.js");
const app = express.Router();

app.get("/", async (req, res, next) => {
  try {
    let data = await Contact.findAll({ order: [["id", "DESC"]] });
    res.render("admin-contact", { data });
  } catch (err) {
    next(err);
  }
});
app.post(
  "/",
  express.urlencoded({ extended: true }),
  async (req, res, next) => {
    try {
      await Contact.create(req.body);
      res.redirect("/index");
    } catch (err) {
      next(err);
    }
  }
);

module.exports = app;
