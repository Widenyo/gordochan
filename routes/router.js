const express = require("express");
const router = express.Router();
const auth = require("../controllers/authController");
const { ban } = require("../controllers/adminTools/ban");
const setInfo = require("../controllers/setInfo");

const indexRouter = require("./index");
const pageRouter = require("./page");
const loginRouter = require("./login");
const registerRouter = require("./register");
const postRouter = require("./post");
const profileRouter = require("./profile");
const logoutRouter = require("./logout");
const tomp3Router = require("./tomp3")
const utilsRouter = require("./utils.js")

//MAIN PAGES
router.use("/page", pageRouter);
router.use("/", indexRouter);
router.use("/login", loginRouter);
router.use("/register", registerRouter);
router.use("/post", postRouter);
router.use("/profile", profileRouter);
router.use("/logout", logoutRouter);
router.use("/tomp3", tomp3Router)

//ROUTERS
router.use("/utils", utilsRouter)

//CONTROLLER METHODS//

router.post(
  "/changePfp",
  auth.isAuthenticated,
  setInfo.uploadPfp.single("avatar"),
  (req, res) => {
    res.redirect("/");
  }
);

router.post(
  "/updateInfo",
  auth.isAuthenticated,
  setInfo.updateInfo,
  (req, res) => {
    res.redirect("/");
  }
);

//ADMIN METHODS//

router.get("/ban/:id", auth.isAuthenticated, auth.isAdmin, ban);

module.exports = router;
