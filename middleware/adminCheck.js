module.exports = {
  verify: function (req, res, next) {
    if (req.session.role && req.session.role == "admin") {
      next();
    } else {
      res.redirect("/login");
    }
  },
  forwardAuth: function (req, res, next) {
    if (req.session.role && req.session.role == "admin") {
      res.redirect("/admin");
    } else {
      next();
    }
  },
  check: function (req, res, next) {
    return req.session.role && req.session.role == "admin";
  },
};
