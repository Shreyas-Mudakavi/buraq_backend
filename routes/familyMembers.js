const express = require("express");

const { auth } = require("../middlewares/auth");
const {
  addFamilyMember,
  getFamilyMembers,
  getFamilyMember,
  updateFamilyMember,
  deleteFamilyMember,
} = require("../controller/familyMembers");

const router = express.Router();

router.post("/add-family", auth, addFamilyMember);

router.get("/getAll-family", auth, getFamilyMembers);

router.get("/get-family/:id", auth, getFamilyMember);

router.put("/update-family/:id", auth, updateFamilyMember);

router.delete("/delete-family/:id", auth, deleteFamilyMember);

module.exports = router;
