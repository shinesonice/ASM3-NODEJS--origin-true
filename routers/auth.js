const router = require("express").Router();
const isAuth = require("../middleware/is-auth").isAuth;

const AuthController = require("../controllers/auth");

router.post("/login", AuthController.postLogin);
router.post("/signup", AuthController.postSignUp);
router.use("/logout", isAuth, AuthController.postLogout);
router.use("/auto-login", AuthController.getAutoLogin);

router.use("/messages", isAuth, AuthController.getMessages);

router.use("/add-message", isAuth, AuthController.postAddMessage);

module.exports = router;
