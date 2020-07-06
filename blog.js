const express = require("express");
const multer = require("multer");
const path = require("path");
const blog = require("./database/models/blog.model.js");
const { Op } = require("sequelize");
const del = require("del");
const defaultImg = path.join(
  process.cwd(),
  "public/uploads/blogs/default-default.jpg"
);

function processTitle(title) {
  title = title.toLowerCase().trim();
  let arr = title.split(" ");
  title = arr.join("-");
  return title;
}

let route = express.Router();
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "public/uploads/blogs"));
  },
  filename: function (req, file, cb) {
    let extension = path.extname(file.originalname);
    cb(null, "blog-" + Date.now().toString() + extension);
  },
});

let upload = multer({ storage: storage });

route.post("/", upload.any(), async (req, res, next) => {
  try {
    req.body.url = processTitle(req.body.title);
    if (blog.count({ where: { url: { [Op.eq]: req.body.url } } }) > 0) {
      res.json({
        success: false,
        message: "Blog with same title exists",
      });
    }
    let file = req.files ? req.files[0] : undefined;
    if (!file) {
      file = {
        path: defaultImg,
      };
    }
    let data = {
      title: req.body.title,
      description: req.body.desc,
      url: req.body.url,
      img: file.path,
      content: req.body.content,
    };
    await blog.create(data);
    res.redirect("/");
  } catch (err) {
    next(err);
  }
});

route.get("/:url", async (req, res, next) => {
  try {
    let data = await blog.findByPk(req.params.url);
    if (data) {
      upload.any()(req, res, next);
      data.description = req.body.description || data.description;
      data.content = req.body.content || data.content;
      if (req.files) {
      }
    } else {
      res.json({
        success: false,
        blog: null,
      });
    }
  } catch (err) {
    next(err);
  }
});

route.put("/:url", upload.any(), async (req, res, next) => {
  try {
    let data = await blog.findByPk(req.params.url);
    if (data) {
      if (req.files) {
        if (data.img != defaultImg) {
          del.sync(data.img);
          data.img = req.files[0].path;
        }
      }
      data.content = req.body.content || data.content;
      data.title = req.body.title || data.title;
      data.description = req.body.description || data.description;
      await blog.update(data, { where: { url: { [Op.eq]: req.body.url } } });
      res.json({
        success: true,
        blog: data,
      });
    } else {
      res.json({
        success: false,
        blog: null,
      });
    }
  } catch (err) {
    next(err);
  }
});

route.delete("/:url", async (req, res, next) => {
  try {
    let x = await blog.destroy({ where: { url: { [Op.eq]: req.body.url } } });
    res.json({
      success: x > 0,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = route;
