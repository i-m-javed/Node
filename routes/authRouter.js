const authRouter = require("express").Router();
const authController = require("../controllers/authController");

authRouter.get("/login", authController.getLoginPage);
authRouter.post("/login", authController.postLoginPage);
authRouter.post("/logout", authController.postLogout);
authRouter.get("/signup", authController.getSignUpPage);
authRouter.post("/signup", authController.postSignUpPage);
authRouter.get("/terms-and-conditions", authController.getTermsAndConditions);

module.exports = authRouter;
