module.exports = {
  verify: function (req, res, next) {
    if (req.session.role && req.session.role == "admin") {
      next();
    }
    res.redirect("/admin-login");
  },
  forwardAuth: function (req, res, next) {
    if (req.session.role && req.session.role == "admin") {
      res.redirect("/admin");
    }
    next();
  },
};
