const express = require("express");

const {
  register,
  login,
  updateProfile,
  getProfile,
  changePassword,
  verifyMobileNumber,
} = require("../controller/users");
const { auth } = require("../middlewares/auth");

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/verify-mobile", verifyMobileNumber);

router.put("/update-profile", auth, updateProfile);

router.get("/user-profile", auth, getProfile);

router.put("/reset-password", auth, changePassword);

module.exports = router;
