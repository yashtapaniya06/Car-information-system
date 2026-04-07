const express = require('express');
const router = express.Router();
const { addContact } = require('../controllers/contactController');
const { verifyToken } = require('../middleware/authmiddleware');

router.post('/', verifyToken, addContact);

module.exports = router;
