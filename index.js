require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const path = require("path");
const session = require("express-session");
const sessionStore = require("connect-session-sequelize")(session.Store);
const blogRouter = require("./routes/blog.js");
const contactRouter = require("./routes/contact.js");
const adminRouter = require("./routes/admin.js");
const adminCheck = require("./middleware/adminCheck.js");

let sequelizeStore = new sessionStore({
  db: require("./database/db"),
  expiration: 2 * 60 * 60 * 1000, // 2 hours
});

const app = express();

app.use(cors());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: sequelizeStore,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(express.static(path.join(process.cwd(), "public")));

sequelizeStore.sync();

app.set("x-powered-by", false);
app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views"));

app.get("/", (req, res, next) => {
  res.render("index");
});

app.get("/index", (req, res, next) => {
  res.render("index");
});

app.get("/:static", (req, res, next) => {
  try {
    if (
      req.params.static === "blog" ||
      req.params.static === "contact" ||
      req.params.static === "admin"
    ) {
      next();
    } else if (req.params.static.includes("admin")) {
      next();
    } else {
      res.render(req.params.static, function (err, html) {
        if (err) {
          next();
        } else {
          res.send(html);
        }
      });
    }
  } catch (err) {
    next(err);
  }
});

app.use("/blog", blogRouter);
app.use("/contact", contactRouter);
app.use("/admin", adminRouter);

app.use("*", async (req, res, next) => {
  res.redirect("/index");
});

app.use((err, req, res, next) => {
  let message = err.message || "An Error Occurred";
  let code = String(err.code || 500);
  res.render("error", { message, code });
});

const server = http.createServer(app);
server.listen(3000, () => {
  console.log("Server started");
});
