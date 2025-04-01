const express = require("express");
const {
  bloodGroupDetailsContoller,
} = require("../controllers/analyticsController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();


router.get("/bloodGroups-data", authMiddleware, bloodGroupDetailsContoller);

module.exports = router;