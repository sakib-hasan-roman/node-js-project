const express = require("express");
const {
  getAllUsers,
  RegisterUser,
  loginuser,
  authDashBoard,
  profileUpdate,
  showProfileImage,
  userMailSent,
  userMailVerify,
  passwordReset,
  passwordResetLinkSent,
} = require("../controllers/userController");
const authorization = require("../Middlewares/authorization");
const uploadMiddleWare = require("../Middlewares/fileUpload");
const UserRouter = express.Router();

UserRouter.get("/", getAllUsers);
UserRouter.post("/register/user", RegisterUser);
UserRouter.post("/login/user/", loginuser);
UserRouter.get("/dashboard/", authorization, authDashBoard);
UserRouter.post(
  "/profile/update",
  authorization,
  uploadMiddleWare,
  profileUpdate
);
UserRouter.get(
  "/get/profile/image/:imageName",
  authorization,
  showProfileImage
);

// UserRouter.get("/user/email/sent", authorization, showProfileImage);
UserRouter.get("/user-verification", authorization, userMailSent);
UserRouter.get("/user-verification/:token", authorization, userMailVerify);
//**** Reset Password ****/
UserRouter.post("/user/password-reset", passwordResetLinkSent);
UserRouter.post("/user/password-reset/:token", passwordReset);

module.exports = UserRouter;
