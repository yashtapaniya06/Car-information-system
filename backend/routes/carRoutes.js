const express = require('express');
const router = express.Router();

const carController = require('../controllers/carController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

// ================= PUBLIC ROUTES =================
router.get('/', carController.getCars);
router.get('/featured', carController.getFeatured);
router.get('/count', carController.getCarCount);
router.get('/check-model/:model', carController.checkModel);
router.get('/:id', carController.getCarById);

// ================= ADMIN ROUTES =================
router.post('/', verifyToken, verifyAdmin, carController.addCar);
router.put('/:id', verifyToken, verifyAdmin, carController.updateCar);
router.delete('/:id', verifyToken, verifyAdmin, carController.deleteCar);

module.exports = router;