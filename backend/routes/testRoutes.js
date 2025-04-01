const express = require('express')
const { testControllers } = require('../controllers/testControllers')

//route object
const router = express.Router()

//routes
router.get('/',testControllers);

//export
module.exports = router;