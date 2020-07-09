const express = require("express");

const app = express.Router();

app.get("/", async (req, res, next) => {});
app.post(
  "/",
  express.urlencoded({ extended: true }),
  async (req, res, next) => {
    res.redirect("/index");
  }
);

module.exports = app;
