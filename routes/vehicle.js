const express = require("express");

const { auth } = require("../middlewares/auth");
const {
  addVehicle,
  getAllVehicle,
  getVehicle,
  updateVehicle,
  deleteVehicle,
} = require("../controller/vehicle");

const router = express.Router();

router.post("/add-vehicle", auth, addVehicle);
router.get("/all", auth, getAllVehicle);
router.get("/:id", auth, getVehicle);
router.put("/update-vehicle/:id", auth, updateVehicle);
router.delete("/delete/:id", auth, deleteVehicle);

module.exports = router;
