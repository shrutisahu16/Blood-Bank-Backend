const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { createInventoryController, 
    getInventoryController, 
    getDonarsController, 
    getHospitalsController, 
    getOrganisationController,
     getOrganisationForHospitalController, 
     getInventoryHospitalController,
     getRecentInventoryController} = require('../controllers/inventoryController');

const router = express.Router();

//routes
//ADD Inventory || Post
router.post('/create-inventory',authMiddleware,createInventoryController);
//Get all Blood records
router.get('/get-inventory',authMiddleware,getInventoryController);

//Get all recent Blood records
router.get('/get-recent-inventory',authMiddleware,getRecentInventoryController);

//Get Donar records
router.get('/get-donars',authMiddleware,getDonarsController);
//Get Hospital records
router.get('/get-hospitals',authMiddleware,getHospitalsController);

//Get organisation records
router.get('/get-organisation',authMiddleware,getOrganisationController);

//Get organisation records
router.get('/get-organisation-for-hospital',authMiddleware,getOrganisationForHospitalController);

//Get Hospital Blood records
router.post('/get-inventory-hospital',authMiddleware,getInventoryHospitalController);

module.exports = router;