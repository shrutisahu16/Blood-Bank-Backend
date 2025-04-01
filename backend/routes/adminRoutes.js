const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");
const { getDonarsListController, getHospitalListController, getOrgListController, deleteDonarController } = require("../controllers/adminController");

const router = express.Router();

//Routes

//Get || DonarList

router.get("/donar-list",authMiddleware,adminMiddleware,getDonarsListController);
 
//Get HospitalList
router.get("/hospital-list",authMiddleware,adminMiddleware,getHospitalListController);

//Get OrgList
router.get("/org-list",authMiddleware,adminMiddleware,getOrgListController);

//=================
//Delete donar || get
router.delete('/delete-donar/:id',authMiddleware,adminMiddleware,deleteDonarController);
module.exports = router;